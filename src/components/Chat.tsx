/* eslint-disable react-hooks/exhaustive-deps */
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Select } from "./select";
import chats from "../services/chats";
import { useChat } from "../contexts/ChatContext";
import { Message } from "../types";

const Chat = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    setMessages,
    setIsSendChatLoading,
    handleSendChat,
    setIsFirstTimeSend,
    getSessions,
  } = useChat();

  const hasFetched = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [documentList, setDocumentList] = useState<{ name: string }[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleGenerateSessionId = async () => {
    try {
      const response = await chats.createSession(token || "");
      if (response?.status === 200) {
        navigate(`/chat/${response?.data?.session_id}`);
        setIsSendChatLoading(true);
        getSessions(token || "");
        handleSendChat(
          response?.data?.session_id,
          selectedDocument?.value || "",
          message,
          token || ""
        );
      } else {
        toast.error("Something want wrong");
      }
    } catch (error: any) {
      toast.error("Your session has expired. Please log in again.");
      console.error(error);
    }
  };

  const handleGetDocumentList = async () => {
    try {
      const response = await chats.getDocuments(token || "");
      if (response?.status === 200) {
        setDocumentList(response?.data);
        setSelectedDocument({
          label: response?.data[0]?.name,
          value: response?.data[0]?.name,
        });
      } else {
        toast.error("Something want wrong");
      }
    } catch (error: any) {
      if (error.response.data.detail === "Could not validate credentials") {
        toast.error("Your session has expired. Please log in again.");
      }
      console.error(error);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setMessages([]);
    setIsFirstTimeSend(true);
    if (message?.trim()) {
      const newMsg: Message = {
        role: "user",
        content: message.trim(),
      };
      setMessages((prev) => [...prev, newMsg]);
      handleGenerateSessionId();
    } else {
      toast.error("Please fill required fields.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!hasFetched.current && token) {
      handleGetDocumentList();
      hasFetched.current = true;
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-full text-black p-4">
      <div className="w-full max-w-3xl space-y-8 m-auto">
        <h1 className="text-3xl font-semibold text-center font-poppins text-black">
          What do you want to know?
        </h1>

        <div className="flex flex-col gap-2">
          <Select
            options={documentList?.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            className="max-w-[300px]"
            value={selectedDocument}
            onChange={(option) => setSelectedDocument(option)}
          />
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 bg-white p-3 rounded-lg"
          >
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent font-poppins border-none outline-none text-black placeholder:text-gray-400 focus-visible:ring-0 text-base pr-4 min-h-[70px] max-h-[200px] py-2 shadow-none resize-none overflow-y-auto"
              placeholder="Ask anything..."
              required
              rows={1}
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-2.5 py-2"
            >
              <Send className="h-5 w-5 mt-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
