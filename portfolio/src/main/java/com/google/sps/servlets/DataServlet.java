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
import com.google.gson.Gson;
import java.util.ArrayList;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/** Servlet that allows users to add comments and returns comment history */
@WebServlet("/comments")
public class DataServlet extends HttpServlet {
    
  private ArrayList<String> helloMessages;

  @Override
  public void init() {
    helloMessages = new ArrayList<>();
    helloMessages.add("Hello there!");
    helloMessages.add("Hope your day is going well!");
    helloMessages.add("Gday to you!");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Gson gson = new Gson();
    String json = gson.toJson(helloMessages);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String name = request.getParameter("name");
    String email = request.getParameter("email");
    String comment = request.getParameter("comment");
    String fullComment = new String();

    // Builds comment message
    if (name == null || name.equals("")) {
      name = "Anonymous";
    }

    if (email == null || email.equals("")) {
        fullComment = name + " said: " + comment;
    } else {
        fullComment = name + " at " + email + " said: " + comment;
    }

    commentsHistory.add(fullComment);
    
    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }

}
