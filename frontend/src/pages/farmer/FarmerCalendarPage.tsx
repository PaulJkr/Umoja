import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  useFarmerCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from "../../services/calendarService";
import { useAuthStore } from "../../context/authStore";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Type,
  FileText,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";

const localizer = momentLocalizer(moment);

// Event interface
interface CalendarEvent {
  _id: string;
  title: string;
  type: string;
  start: string;
  end: string;
  description?: string;
}

// Add/Edit Task Modal Component
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  selectedDate?: Date;
  editingEvent?: CalendarEvent | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  editingEvent,
}) => {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || "",
    type: editingEvent?.type || "planting",
    start: editingEvent?.start
      ? moment(editingEvent.start).format("YYYY-MM-DDTHH:mm")
      : selectedDate
      ? moment(selectedDate).format("YYYY-MM-DDTHH:mm")
      : "",
    end: editingEvent?.end
      ? moment(editingEvent.end).format("YYYY-MM-DDTHH:mm")
      : selectedDate
      ? moment(selectedDate).add(1, "hour").format("YYYY-MM-DDTHH:mm")
      : "",
    description: editingEvent?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(
      editingEvent ? { ...formData, eventId: editingEvent._id } : formData
    );
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "planting",
      start: "",
      end: "",
      description: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "planting":
        return "🌱";
      case "harvest":
        return "🌾";
      case "maintenance":
        return "🔧";
      case "irrigation":
        return "💧";
      case "fertilizing":
        return "🌿";
      case "pest_control":
        return "🐛";
      case "meeting":
        return "👥";
      default:
        return "📝";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingEvent ? "Edit Task" : "Add New Task"}
                </h3>
                <p className="text-sm text-gray-600">
                  {editingEvent
                    ? "Update your task details"
                    : "Schedule a new farm activity"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4" />
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="e.g., Plant Maize"
                required
              />
            </div>

            {/* Task Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Task Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              >
                <option value="planting">🌱 Planting</option>
                <option value="harvest">🌾 Harvest</option>
                <option value="maintenance">🔧 Maintenance</option>
                <option value="irrigation">💧 Irrigation</option>
                <option value="fertilizing">🌿 Fertilizing</option>
                <option value="pest_control">🐛 Pest Control</option>
                <option value="meeting">👥 Meeting</option>
                <option value="other">📝 Other</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                End Time *
              </label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Optional task description..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="flex-1 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {editingEvent ? "Update Task" : "Add Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const FarmerCalendarPage: React.FC = () => {
  const { user } = useAuthStore();
  const farmerId = user?._id;

  const {
    data: events,
    isLoading,
    refetch,
  } = useFarmerCalendarEvents(farmerId || "");
  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const [view, setView] = useState<View>("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const calendarEvents = useMemo(() => {
    return (events || []).map((event: CalendarEvent) => ({
      id: event._id,
      title: `${event.title} (${event.type})`,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: false,
      resource: event, // Store the full event data
    }));
  }, [events]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: any) => {
    const originalEvent = event.resource;
    setEditingEvent(originalEvent);
    setShowModal(true);
  };

  const handleAddTask = () => {
    setSelectedDate(new Date());
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleSubmitTask = async (taskData: any) => {
    try {
      if (taskData.eventId) {
        // Update existing event
        const { eventId, ...updateData } = taskData;
        await updateEvent.mutateAsync({ eventId, ...updateData });
        toast.success(`Task "${taskData.title}" updated successfully! ✏️`);
      } else {
        // Create new event
        await createEvent.mutateAsync(taskData);
        toast.success(`Task "${taskData.title}" added successfully! 🎉`);
      }

      refetch();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteEvent.mutateAsync(eventId);
        toast.success("Task deleted successfully! 🗑️");
        refetch();
      } catch (error) {
        toast.error("Failed to delete task. Please try again.");
      }
    }
  };

  if (!farmerId) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Please log in to view your calendar
            </h3>
            <p className="text-gray-600">
              Access your farming schedule and task management
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Calendar
              </h1>
              <p className="text-gray-600">
                Plan and track your farming activities and schedule
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={handleAddTask}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Calendar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Farm Schedule
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click on dates to add tasks, or click existing tasks to edit
                  </p>
                </div>
              </div>

              {events && events.length > 0 && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {events.length}
                  </p>
                  <p className="text-xs text-gray-600">Scheduled Tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600 font-medium">
                    Loading calendar events...
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={["month", "week", "day"]}
                  view={view}
                  onView={setView}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  popup
                  components={{
                    event: ({ event }) => (
                      <div className="flex items-center justify-between w-full group">
                        <span className="truncate flex-1 text-xs">
                          {event.title}
                        </span>
                        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingEvent(event.resource);
                              setShowModal(true);
                            }}
                            className="p-1 hover:bg-blue-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3 text-blue-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              handleDeleteEvent(
                                event.resource._id,
                                event.resource.title
                              );
                            }}
                            className="p-1 hover:bg-red-200 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </motion.button>
                        </div>
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Task Modal */}
        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitTask}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />
      </div>
    </div>
  );
};
