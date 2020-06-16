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

package com.google.sps.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.util.ArrayList;
import java.util.Arrays;

public class Entities {

  /** Helper method that deletes single entity by user given its id and kind */
  public static void deleteSingle(long id, String kind) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key entityKey = KeyFactory.createKey(kind, id);

    Query query = new Query(kind);

    UserService userService = UserServiceFactory.getUserService();
    String userId = userService.getCurrentUser().getUserId();

    // userId is used as a filter to avoid results that include an entity not created by the logged
    // user
    Query.CompositeFilter queryFilter =
        new Query.CompositeFilter(
            Query.CompositeFilterOperator.AND,
            Arrays.asList(
                new Query.FilterPredicate("userId", Query.FilterOperator.EQUAL, userId),
                new Query.FilterPredicate("__key__", Query.FilterOperator.EQUAL, entityKey)));

    query.setFilter(queryFilter);
    PreparedQuery results = datastore.prepare(query);
    Entity entity = results.asSingleEntity();
    datastore.delete(entity.getKey());
  }

  /** Helper method that deletes all entities by the logged user given its kind */
  public static ArrayList<Long> deleteAll(String kind) {
    UserService userService = UserServiceFactory.getUserService();
    String userId = userService.getCurrentUser().getUserId();

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query(kind);
    query.setFilter(new Query.FilterPredicate("userId", Query.FilterOperator.EQUAL, userId));
    PreparedQuery results = datastore.prepare(query);

    ArrayList<Long> deletedIds = new ArrayList<>();

    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      datastore.delete(entity.getKey());
      deletedIds.add(id);
    }

    return deletedIds;
  }
}
