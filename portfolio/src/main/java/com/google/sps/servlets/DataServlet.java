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
import com.google.gson.Gson;
import java.util.ArrayList;
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

    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    String maxCommentsString = request.getParameter("numcomments");

    // Convert the input to an int.
    try {
        maxComments = Integer.parseInt(maxCommentsString);
    } catch (NumberFormatException e) {
        System.err.println("Could not convert to int: " +  maxCommentsString);
    }

    ArrayList<String> comments = new ArrayList<>();

    int currentCount = 0;

    for (Entity entity : results.asIterable()) {
      if (currentCount >= maxComments) break;
      String message = (String) entity.getProperty("message");
      comments.add(message);
      currentCount++;
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
    String fullComment = new String();
    long timestamp = System.currentTimeMillis();
    

    // Builds comment message
    if (name.isEmpty()) {
      name = "Anonymous";
    }

    if (email.isEmpty()) {
        fullComment = name + " said: " + comment;
    } else {
        fullComment = name + " at " + email + " said: " + comment;
    }

    Entity commentsEntity = new Entity("Comment");
    commentsEntity.setProperty("message", fullComment);
    commentsEntity.setProperty("timestamp", timestamp);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentsEntity);
    
    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }


}
