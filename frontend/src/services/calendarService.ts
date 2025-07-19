// src/services/calendarService.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export const useFarmerCalendarEvents = (farmerId: string) => {
  return useQuery({
    queryKey: ["calendarEvents", farmerId],
    queryFn: async () => {
      const res = await api.get(`/calendar/farmer/${farmerId}`);
      return res.data;
    },
    enabled: !!farmerId,
  });
};

// Create calendar event mutation
export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: {
      title: string;
      type: string;
      start: string;
      end: string;
      description?: string;
    }) => {
      const res = await api.post("/calendar/events", eventData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch calendar events after successful creation
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents"],
      });
    },
  });
};

// Update calendar event mutation
export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      ...eventData
    }: {
      eventId: string;
      title?: string;
      type?: string;
      start?: string;
      end?: string;
      description?: string;
    }) => {
      const res = await api.put(`/calendar/events/${eventId}`, eventData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents"],
      });
    },
  });
};

// Delete calendar event mutation
export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await api.delete(`/calendar/events/${eventId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents"],
      });
    },
  });
};
