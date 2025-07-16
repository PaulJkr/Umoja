import React, { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface Event {
  id: string;
  title: string;
  date: string;
  notes?: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("buyerEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  const saveEvents = (updated: Event[]) => {
    setEvents(updated);
    localStorage.setItem("buyerEvents", JSON.stringify(updated));
  };

  const addEvent = () => {
    if (!title || !date) {
      toast.warning("Title and Date are required.");
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      date,
      notes,
    };

    const updated = [...events, newEvent];
    saveEvents(updated);
    toast.success("Event added!");

    setTitle("");
    setDate("");
    setNotes("");
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
    toast.info("Event removed.");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Calendar</h2>

      {/* Event Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 border rounded-lg shadow">
        <input
          type="text"
          placeholder="Event Title"
          className="border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          className="border px-3 py-2 rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={addEvent}
          className="md:col-span-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
        >
          <Plus className="inline w-4 h-4 mr-1" />
          Add Event
        </button>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center pt-6">
            No upcoming events. Add one above.
          </p>
        ) : (
          events
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((event) => (
              <div
                key={event.id}
                className="bg-white border rounded-lg p-4 shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">📅 {event.date}</p>
                  {event.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      📝 {event.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
