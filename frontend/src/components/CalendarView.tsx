// components/CalendarView.tsx
import React, { useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "../utils/calendarLocalizer";

const CalendarView = () => {
  const [events, setEvents] = useState([
    {
      title: "Harvest tomatoes",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
    {
      title: "Buy fertilizer",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  ]);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      style={{ height: 500 }}
      selectable
      onSelectEvent={(event) => alert(`Event: ${event.title}`)}
      onSelectSlot={(slotInfo) => {
        const title = prompt("Enter event title");
        if (title) {
          setEvents((prev) => [
            ...prev,
            {
              title,
              start: slotInfo.start,
              end: slotInfo.end,
            },
          ]);
        }
      }}
    />
  );
};

export default CalendarView;
