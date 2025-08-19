// components/CalendarView.tsx
import React, { useState, useRef } from "react";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "../utils/calendarLocalizer";
import { useAuthStore } from "../context/authStore";
import {
  useFarmerCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from "../services/calendarService";
import { format, parseISO, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const CalendarView = () => {
  const { user } = useAuthStore();
  const {
    data: events,
    isLoading,
    isError,
  } = useFarmerCalendarEvents(user?._id ?? "");

  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  type CalendarEvent = {
    _id: string;
    title: string;
    type?: string;
    start: string | Date;
    end: string | Date;
    description?: string;
    [key: string]: any;
  };

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventForm, setEventForm] = useState({
    title: "",
    type: "",
    start: "",
    end: "",
    description: "",
  });

  const handleSelectEvent = (event: any) => {
    console.log("handleSelectEvent called with event:", event);
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      type: event.type || "",
      start: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      end: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      description: event.description || "",
    });
    setIsModalOpen(true);
    console.log("selectedEvent after set:", event); // This will log the event object
    console.log("eventForm after set:", eventForm); // This will log the eventForm object
  };

  const handleSelectSlot = (
    slotInfo: import("react-big-calendar").SlotInfo
  ) => {
    console.log("handleSelectSlot called with slotInfo:", slotInfo);
    setSelectedEvent(null);
    setEventForm({
      title: "",
      type: "",
      start: format(new Date(slotInfo.start), "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(slotInfo.end), "yyyy-MM-dd'T'HH:mm"),
      description: "",
    });
    setIsModalOpen(true);
    console.log("selectedEvent after set (null):");
    console.log("eventForm after set (new):");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const eventData = {
        ...eventForm,
        start: parse(eventForm.start, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString(),
        end: parse(eventForm.end, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString(),
      };

      if (selectedEvent) {
        await updateEvent.mutateAsync({
          eventId: selectedEvent._id,
          ...eventData,
        });
        toast.success("Event updated successfully!");
      } else {
        await createEvent.mutateAsync(eventData);
        toast.success("Event created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await deleteEvent.mutateAsync(selectedEvent._id);
      toast.success("Event deleted successfully!");
      setIsModalOpen(false);
      setSelectedEvent(null);
    } finally {
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  if (isError) {
    return <div>Error loading calendar.</div>;
  }

  // Map events to ensure start and end are Date objects for react-big-calendar
  const formattedEvents = events.map((event: CalendarEvent) => ({
    ...event,
    start: parseISO(event.start as string),
    end: parseISO(event.end as string),
  }));

  return (
    <>
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        style={{ height: 500 }}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent
                ? "Edit the details of your event."
                : "Add a new event to your calendar."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                name="type"
                value={eventForm.type}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Start
              </Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                value={eventForm.start}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                End
              </Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                value={eventForm.end}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {selectedEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button onClick={handleSave}>
              {selectedEvent ? "Save Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarView;
