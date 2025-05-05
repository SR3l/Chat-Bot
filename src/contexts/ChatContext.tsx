import React, { createContext, useContext, useState } from "react";

import { ChatSession, Message } from "../types";
import chats from "../services/chats";
import { toast } from "react-toastify";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isSendChatLoading: boolean;
  setIsSendChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstTimeSend: boolean;
  setIsFirstTimeSend: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendChat: (
    session_id: string,
    document_name: string,
    question: string,
    token: string
  ) => Promise<void>;
  getSessions: (token: string) => Promise<void>;
  sessionList: ChatSession[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendChatLoading, setIsSendChatLoading] = useState(false);
  const [isFirstTimeSend, setIsFirstTimeSend] = useState(false);
  const [sessionList, setSessionsList] = useState<ChatSession[]>([]);
  const handleSendChat = async (
    session_id: string,
    document_name: string,
    question: string,
    token: string
  ) => {
    try {
      const response = await chats.sendAskChat(token || "", {
        document_name,
        question,
        session_id,
      });
      if (response?.status === 200) {
        setMessages((prev) => [
          ...prev,
          {
            content: response?.data?.answer,
            role: "assistant",
          },
        ]);
        setIsFirstTimeSend(false);
      } else {
        toast.error("Something want wrong");
      }
    } catch (error: any) {
      toast.error("Your session has expired. Please log in again.");
      console.error(error);
    } finally {
      setIsSendChatLoading(false);
    }
  };

  const getSessions = async (token: string) => {
    try {
      const response = await chats.getSessions(token || "");

      if (response?.status === 200) {
        setSessionsList(response?.data);
      } else {
        toast.error("Something want wrong");
      }
    } catch (error: any) {
      toast.error("Your session has expired. Please log in again.");
      console.error(error);
    } finally {
      //setIsSendChatLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        setMessages,
        messages,
        isSendChatLoading,
        setIsSendChatLoading,
        isFirstTimeSend,
        setIsFirstTimeSend,
        handleSendChat,
        getSessions,
        sessionList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  console.log(context)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
