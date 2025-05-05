export interface Session {
  id: string;
  created_at: string;
}

export interface ChatEntry {
  question: string;
  answer: string;
  timestamp: string;
}

export interface User {
  email: string;
  username: string;
}
export interface ChatSession {
  session_id: string;
  session_name: string;
  created_at: string;
  last_updated: string;
}
export interface MessagesType {
  message_id: string;
  role: string;
  created_at: string;
  last_updated: string;
}
