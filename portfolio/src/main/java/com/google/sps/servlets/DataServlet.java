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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import com.google.sps.data.Comment;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that allows users to add comments and returns comment history  */
@WebServlet("/comments")
public class DataServlet extends HttpServlet {  
  
  private static int maxComments;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String filter = request.getParameter("filter");

    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    if (!filter.equals("undefined") && !filter.isEmpty()) {
        Query.Filter queryFilter = new Query.FilterPredicate("name", Query.FilterOperator.EQUAL, filter);
        query.setFilter(queryFilter);
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    String maxCommentsString = request.getParameter("maxcomments");

    // Convert the input to an int.
    try {
        maxComments = Integer.parseInt(maxCommentsString);
    } catch (NumberFormatException e) {
        System.err.println("Could not convert to int: " +  maxCommentsString);
        maxComments = 5;
    }

    List<Entity> results = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(maxComments));

    ArrayList<Comment> comments = new ArrayList<>();

    for (Entity entity : results) {
      long id = entity.getKey().getId();
      String name = (String) entity.getProperty("name");
      String email = (String) entity.getProperty("email");
      String message = (String) entity.getProperty("message");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment comment = new Comment(id, name, email, message, timestamp);
      comments.add(comment);
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String name = request.getParameter("name");
    String email = request.getParameter("email");
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

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentsEntity);
    
    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

    if (request.getParameter("id").equals("all")) {
        
        Query query = new Query("Comment");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        for (Entity entity : results.asIterable()) {
            datastore.delete(entity.getKey());
        }

    } else {

        long id;

        try {
            id = Long.parseLong(request.getParameter("id"));
    
        } catch (NumberFormatException e) {
            System.err.println("Could not convert to long");
            id = -1;
        }

        if (id > 0) {
            Key commentEntityKey = KeyFactory.createKey("Comment", id);
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            datastore.delete(commentEntityKey);
        }
    
    }
    
    response.setContentType("text/html");
    response.getWriter().println();

    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }


}
