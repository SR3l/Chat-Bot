import { ArrowDown, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { Select } from "../select";
import chats from "../../services/chats";
import { useChat } from "../../contexts/ChatContext";
import { Skeleton } from "../skeleton";

interface Message {
  message_id: string | number;
  role: "user" | "assistant";
  content: string;
}

const ChatDetailsPage = () => {
  const { slug: sessionId } = useParams();
  const { token } = useAuth();
  const {
    messages,
    setMessages,
    isSendChatLoading,
    handleSendChat,
    setIsSendChatLoading,
    isFirstTimeSend,
  } = useChat();

  const hasFetched = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [documentList, setDocumentList] = useState<{ name: string }[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [message, setMessage] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (isSendChatLoading) {
      return;
    }

    if (message.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: message.trim(),
        },
      ]);
      setMessage("");
      setIsSendChatLoading(true);

      handleSendChat(
        sessionId || "",
        selectedDocument?.value || "",
        message,
        token || ""
      );
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

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollDown(!nearBottom);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!hasFetched.current && token) {
      handleGetDocumentList();
      hasFetched.current = true;
    }
  }, [token]);

  const getChatHistory = async () => {
    setMessages([]);
    try {
      const response = await chats.getChatHistory(token || "", sessionId || "");
      if (response) {
        setMessages((prev) => [...prev, ...response.data]);
      } else {
        toast.error("Something want wrong");
      }
    } catch (error: any) {
      toast.error("Your session has expired. Please log in again.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (sessionId && token && !isFirstTimeSend) {
      getChatHistory();
    }
  }, [sessionId, token]);

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex-1 overflow-auto"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className="h-full  py-16 px-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              id={`msg-user-${msg.message_id}`}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 ${
                  msg.role === "user"
                    ? "bg-[#152644] text-white max-w-[300px] rounded-2xl"
                    : "bg-gray-200 text-black max-w-[800px] rounded-2xl"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isSendChatLoading && (
            <div className="flex justify-start">
              <div className="space-y-3 w-full max-w-[600px]">
                <div className="flex items-center space-x-2"></div>
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 relative">
        <div className="flex flex-col gap-2">
          <Select
            options={documentList?.map(({ name }) => ({
              label: name,
              value: name,
            }))}
            menuPlacement="top"
            className="max-w-[300px]"
            value={selectedDocument}
            onChange={(option) => setSelectedDocument(option)}
          />
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 bg-white border border-gray-300 p-3 rounded-lg"
          >
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${
                isSendChatLoading ? "cursor-none" : ""
              } w-full bg-transparent font-poppins border-none outline-none text-black placeholder:text-gray-400 focus-visible:ring-0 text-base pr-4 min-h-[70px] max-h-[140px] py-2 shadow-none resize-none overflow-y-auto`}
              placeholder="Ask anything..."
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

        {showScrollDown && (
          <div className="absolute -top-8 w-full flex items-center justify-center">
            <button
              onClick={scrollToBottom}
              className=" bg-black text-white p-2 rounded-full shadow-md"
            >
              <ArrowDown />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetailsPage;
