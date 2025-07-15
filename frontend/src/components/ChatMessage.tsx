// src/components/ChatMessage.tsx
import React from "react";
import clsx from "clsx";

interface Props {
  content: string;
  isSender: boolean;
}

const ChatMessage: React.FC<Props> = ({ content, isSender }) => {
  return (
    <div
      className={clsx(
        "p-3 max-w-xs rounded-lg shadow text-sm mb-2",
        isSender
          ? "bg-green-100 self-end text-right"
          : "bg-gray-100 self-start text-left"
      )}
    >
      {content}
    </div>
  );
};

export default ChatMessage;
