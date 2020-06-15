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
import java.util.List;
import java.util.Set;
import java.util.HashSet;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<Event> sortedEvents = new ArrayList<>(events);  
    int start = TimeRange.START_OF_DAY;
    int duration = (int) request.getDuration();

    Collection<String> attendees = request.getAttendees();
    Collection<TimeRange> result = new ArrayList<>();

    Collections.sort(sortedEvents, Event.ORDER_BY_START);
    
    for (Event event : sortedEvents) {
      Set<String> intersection = new HashSet<>(attendees);
      intersection.retainAll(event.getAttendees()); 
      TimeRange eventTR = event.getWhen();
      TimeRange timerange = TimeRange.fromStartDuration(start, duration);
      if (!intersection.isEmpty()) {
          if (!eventTR.overlaps(timerange) && start != eventTR.start()) {
              result.add(TimeRange.fromStartEnd(start, eventTR.start(), false));
          }
      } else if(start != eventTR.end()) {
          result.add(TimeRange.fromStartEnd(start, eventTR.end(), true));
      }
      start = eventTR.end();
    }

    if (start != TimeRange.END_OF_DAY) {
      result.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }


    return result;

  }
}
