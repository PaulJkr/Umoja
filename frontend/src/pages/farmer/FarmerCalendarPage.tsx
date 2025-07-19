// src/pages/farmer/CalendarPage.tsx

import React, { useMemo, useState } from "react";
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
import { Plus, X, Edit, Trash2 } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">
            {editingEvent ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Plant Maize"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="planting">Planting</option>
              <option value="harvest">Harvest</option>
              <option value="maintenance">Maintenance</option>
              <option value="irrigation">Irrigation</option>
              <option value="fertilizing">Fertilizing</option>
              <option value="pest_control">Pest Control</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Optional task description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingEvent ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
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
      <div className="p-4 w-full">
        <div className="text-center p-6 text-gray-500">
          Please log in to view your calendar.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Calendar</h2>
        <Button onClick={handleAddTask}>
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </Button>
      </div>

      <div className="h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading calendar events...</p>
            </div>
          </div>
        ) : (
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
                <div className="flex items-center justify-between w-full">
                  <span className="truncate flex-1">{event.title}</span>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event.resource);
                        setShowModal(true);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(
                          event.resource._id,
                          event.resource.title
                        );
                      }}
                      className="p-1 hover:bg-red-200 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              ),
            }}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitTask}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  );
};
