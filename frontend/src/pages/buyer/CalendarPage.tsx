import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Calendar,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateStatus = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) return { status: "past", color: "text-gray-500" };
    if (eventDate.getTime() === today.getTime())
      return { status: "today", color: "text-blue-600" };
    return { status: "upcoming", color: "text-green-600" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2,
      },
    },
  };

  const sortedEvents = events.sort((a, b) => a.date.localeCompare(b.date));
  const todayEvents = sortedEvents.filter(
    (event) => getDateStatus(event.date).status === "today"
  );
  const upcomingEvents = sortedEvents.filter(
    (event) => getDateStatus(event.date).status === "upcoming"
  );
  const pastEvents = sortedEvents.filter(
    (event) => getDateStatus(event.date).status === "past"
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200/60 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Calendar
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your events and stay organized
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
              <CalendarDays className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-medium">
                {events.length} {events.length === 1 ? "event" : "events"}{" "}
                scheduled
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Event Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Event
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                placeholder="Enter event title"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add notes"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <motion.button
            onClick={addEvent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </motion.button>
        </motion.div>

        {/* Events Display */}
        <div className="space-y-8">
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Today</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {todayEvents.length}
                </span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {todayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={deleteEvent}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Upcoming
                </h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {upcomingEvents.length}
                </span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={deleteEvent}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Past Events
                </h3>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pastEvents.length}
                </span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={deleteEvent}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center py-20"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No events scheduled
                </h3>
                <p className="text-gray-600 mb-4">
                  Start organizing your schedule by adding your first event.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
                  onClick={() =>
                    (
                      document.querySelector(
                        'input[type="text"]'
                      ) as HTMLInputElement | null
                    )?.focus()
                  }
                >
                  Add Your First Event
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventCard = ({
  event,
  onDelete,
}: {
  event: Event;
  onDelete: (id: string) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateStatus = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today)
      return { status: "past", color: "text-gray-500", bg: "bg-gray-50" };
    if (eventDate.getTime() === today.getTime())
      return { status: "today", color: "text-blue-600", bg: "bg-blue-50" };
    return { status: "upcoming", color: "text-green-600", bg: "bg-green-50" };
  };

  const dateStatus = getDateStatus(event.date);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }}
      exit={{
        opacity: 0,
        x: -100,
        transition: {
          duration: 0.2,
        },
      }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-3 h-3 rounded-full ${
                dateStatus.status === "today"
                  ? "bg-blue-500"
                  : dateStatus.status === "upcoming"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {event.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className={`font-medium ${dateStatus.color}`}>
              {formatDate(event.date)}
            </span>
            {dateStatus.status === "today" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Today
              </span>
            )}
          </div>

          {event.notes && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
              <FileText className="w-4 h-4 mt-0.5 text-gray-400" />
              <span>{event.notes}</span>
            </div>
          )}
        </div>

        <motion.button
          onClick={() => onDelete(event.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CalendarPage;
