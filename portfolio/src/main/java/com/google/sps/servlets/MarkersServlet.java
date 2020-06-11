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
import com.google.sps.data.Marker;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Fetches and stores markers. */
@WebServlet("/markers")
public class MarkersServlet extends HttpServlet {

    /** Responds with marker data. */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Query query = new Query("Marker");

        ArrayList<Marker> markers = new ArrayList<>();

        PreparedQuery results = datastore.prepare(query);

        for (Entity entity : results.asIterable()) {
        long id = entity.getKey().getId();
        double lat = (double) entity.getProperty("lat");
        double lng = (double) entity.getProperty("lng");
        String userId = (String) entity.getProperty("userId");

        Marker marker = new Marker(lat, lng, userId, id);
        markers.add(marker);
        }

        Gson gson = new Gson();

        response.getWriter().println(gson.toJson(markers));

    }

    /** Receives and stores a new marker, then sends it. */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();

        String userId = userService.getCurrentUser().getUserId();
        double lat = Double.parseDouble(request.getParameter("lat"));
        double lng = Double.parseDouble(request.getParameter("lng"));

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Entity entity = new Entity("Marker");
        entity.setProperty("lat", lat);
        entity.setProperty("lng", lng);
        entity.setProperty("userId", userId);

        datastore.put(entity);

        long id = entity.getKey().getId();

        Marker marker = new Marker(lat, lng, userId, id);

        Gson gson = new Gson();

        response.getWriter().println(gson.toJson(marker));

    }

    /** Deletes Markers */
    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        UserService userService = UserServiceFactory.getUserService();

        String userId = userService.getCurrentUser().getUserId();

        double lat = Double.parseDouble(request.getParameter("lat"));
        double lng = Double.parseDouble(request.getParameter("lng"));

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Query query = new Query("Marker");
        Query.CompositeFilter queryFilter = new Query.CompositeFilter(Query.CompositeFilterOperator.AND, Arrays
                .asList(new Query.FilterPredicate("userId", Query.FilterOperator.EQUAL, userId), new Query
                .FilterPredicate("lat", Query.FilterOperator.EQUAL, lat), new Query
                .FilterPredicate("lng", Query.FilterOperator.EQUAL, lng)));

        query.setFilter(queryFilter);

        PreparedQuery results = datastore.prepare(query);
        Entity entity = results.asSingleEntity();

        if (entity != null){
            datastore.delete(entity.getKey());
        }

        response.setContentType("text/html;");

        response.getWriter().println();
    }

}
