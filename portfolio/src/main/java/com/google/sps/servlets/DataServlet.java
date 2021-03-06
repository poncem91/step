// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import com.google.sps.data.Entities;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that allows users to add comments and returns comment history */
@WebServlet("/comments")
public class DataServlet extends HttpServlet {

  private static int maxComments;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String filter = request.getParameter("filter");
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    if (!filter.isEmpty()) {
      Query.Filter queryFilter =
          new Query.FilterPredicate("name", Query.FilterOperator.EQUAL, filter);
      query.setFilter(queryFilter);
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    String maxCommentsString = request.getParameter("maxcomments");

    // Convert the input to an int.
    try {
      maxComments = Integer.parseInt(maxCommentsString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + maxCommentsString);
      maxComments = 5;
    }

    List<Entity> results =
        datastore.prepare(query).asList(FetchOptions.Builder.withLimit(maxComments));

    ArrayList<Comment> comments = new ArrayList<>();

    for (Entity entity : results) {
      long id = entity.getKey().getId();
      String name = (String) entity.getProperty("name");
      String message = (String) entity.getProperty("message");
      long timestamp = (long) entity.getProperty("timestamp");
      String userId = (String) entity.getProperty("userId");

      Comment comment = new Comment(id, name, message, timestamp, userId);
      comments.add(comment);
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    UserService userService = UserServiceFactory.getUserService();

    String userId = userService.getCurrentUser().getUserId();
    String name = request.getParameter("name");
    String email = userService.getCurrentUser().getEmail();
    String comment = request.getParameter("comment");
    long timestamp = System.currentTimeMillis();

    if (name.isEmpty()) {
      name = "Anonymous";
    }

    Entity commentsEntity = new Entity("Comment");
    commentsEntity.setProperty("name", name);
    commentsEntity.setProperty("email", email);
    commentsEntity.setProperty("message", comment);
    commentsEntity.setProperty("timestamp", timestamp);
    commentsEntity.setProperty("userId", userId);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentsEntity);

    // Redirect back to home page.
    response.sendRedirect("/");
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response)
      throws IOException {

    if (request.getParameter("id").equals("all")) {
      Entities.deleteAll("Comment");
    } else {
      long id;

      try {
        id = Long.parseLong(request.getParameter("id"));
      } catch (NumberFormatException e) {
        System.err.println("Could not convert to long");
        id = -1;
      }

      if (id > 0) {
        Entities.deleteSingle(id, "Comment");
      }
    }
    response.setContentType("text/html;");
    response.getWriter().println();
  }
}
