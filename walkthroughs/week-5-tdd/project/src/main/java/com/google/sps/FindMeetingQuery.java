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
      
    int start = TimeRange.START_OF_DAY;
    int duration = (int) request.getDuration();
    Collection<String> attendees = request.getAttendees();
    
    Collection<TimeRange> result = new ArrayList<>();
    List<Event> sortedEvents = new ArrayList<>();

    if (duration > TimeRange.WHOLE_DAY.duration()){
        return result;
    }

    // Considers and adds only events with mutual attendees
    for (Event event : events) {
        Set<String> mutualAttendees = new HashSet<>(attendees);
        mutualAttendees.retainAll(event.getAttendees());
        if (!mutualAttendees.isEmpty()) {
            sortedEvents.add(event);
        }
    }
    Collections.sort(sortedEvents, Event.ORDER_BY_START);

    // Determines possible meeting times before and in between events
    for (Event event : sortedEvents) {
      TimeRange eventTR = event.getWhen();
      if (start <= eventTR.start()) {
        TimeRange proposedTR = TimeRange.fromStartDuration(start, duration);
        if (!eventTR.overlaps(proposedTR) && start != eventTR.start()) {
          result.add(TimeRange.fromStartEnd(start, eventTR.start(), false));   
        }
        start = eventTR.end();
      } else if (eventTR.end() > start) start = eventTR.end();
    }

    // Assesses remaining time left in day after events are finished
    if (start != (TimeRange.END_OF_DAY + 1)) {
      TimeRange restOfDay = TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true);
      if (restOfDay.duration() >= duration) result.add(endOfDay);
    }
    
    return result;
  }
}
