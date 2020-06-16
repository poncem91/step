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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) return Arrays.asList();
      
    Collection<String> mandatoryAttendees = request.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();
    Collection<String> totalAttendees = new HashSet<>(mandatoryAttendees);
    for (String attendee : optionalAttendees) {
        totalAttendees.add(attendee);
    }
    
    List<Event> sortedEventsWithOptionals = createEventsList(events,totalAttendees);
    List<Event> sortedEventsWithoutOptionals = createEventsList(events, mandatoryAttendees);

    List<TimeRange> resultWithOptionals = queryBuilder(sortedEventsWithOptionals, request);
    List<TimeRange> resultWithoutOptionals = queryBuilder(sortedEventsWithoutOptionals, request);    

    if (resultWithOptionals.isEmpty() && !mandatoryAttendees.isEmpty()) return resultWithoutOptionals;
    return resultWithOptionals;
  }

  /** Builds and returns a query results list of timeranges */
  private List<TimeRange> queryBuilder(List<Event> events, MeetingRequest request) {
    int start = TimeRange.START_OF_DAY;
    int duration = (int) request.getDuration();
    List<TimeRange> results = new ArrayList<>();

    // Determines and adds possible meeting times before and in between events
    for (Event event : events) {
      TimeRange eventTR = event.getWhen();
      if (start <= eventTR.start()) {
        TimeRange proposedTR = TimeRange.fromStartDuration(start, duration);
        if (!eventTR.overlaps(proposedTR) && start != eventTR.start()) {
          results.add(TimeRange.fromStartEnd(start, eventTR.start(), false));   
        }
        start = eventTR.end();
      } else if (eventTR.end() > start) start = eventTR.end();
    }

    // Assesses and adds possible remaining time left in day after events are finished
    if (start != (TimeRange.END_OF_DAY + 1)) {
      TimeRange restOfDay = TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true);
      if (restOfDay.duration() >= duration) results.add(restOfDay);
    }
    return results;
  }

  /** Creates and returns a list of events that include certain attendees */
  private List<Event> createEventsList(Collection<Event> events, Collection<String> attendees) {
    List<Event> eventsList = new ArrayList<>();
    for (Event event : events) {
      Set<String> mutualAttendees = new HashSet<>(attendees);
      mutualAttendees.retainAll(event.getAttendees());
      if (!mutualAttendees.isEmpty()) eventsList.add(event);
    }
    Collections.sort(eventsList, Event.ORDER_BY_START);
    return eventsList;
  }
}