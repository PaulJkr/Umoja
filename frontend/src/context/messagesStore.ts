// src/context/messagesStore.ts
import { create } from "zustand";

export interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface MessagesState {
  messages: Message[];
  selectedUser: string | null;
  setSelectedUser: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  selectedUser: null,
  setSelectedUser: (id) => set({ selectedUser: id }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));
