export interface Session {
  session_id: string;
  created_at: string;
  last_updated: string;
  document_name: string | null;
  title?: string;
}

export interface ChatEntry {
  session_id: string;
  document_name: string;
  question: string;
  answer: string;
  timestamp: string;
  user_id: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ChatSession {
  session_id: string;
  session_name: string;
  created_at: string;
  last_updated: string;
  document_name: string;
}

export interface UserAskChatPayload {
  document_name: string;
  question: string;
  session_id: string;
}

export interface Message {
  message_id?: string;
  session_id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  user_id?: string;
  document_name?: string;
}
