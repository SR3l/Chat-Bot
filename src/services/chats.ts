import axios, { AxiosResponse } from "axios";
import { UserAskChatPayload } from "../types";

const BASE_URL = "http://156.67.82.131:9076";

const chats = {
  createSession: async (token: string): Promise<AxiosResponse<any>> => {
    const response = await axios.post(`${BASE_URL}/sessions/create`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  sendAskChat: async (
    token: string,
    payload: UserAskChatPayload
  ): Promise<AxiosResponse<any>> => {
    const response = await axios.post(`${BASE_URL}/ask`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  getSessions: async (token: string): Promise<AxiosResponse<any>> => {
    const response = await axios.get(`${BASE_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  getDocuments: async (token: string): Promise<AxiosResponse<any>> => {
    const response = await axios.get(`${BASE_URL}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  getChatHistory: async (
    token: string,
    sessionId: string
  ): Promise<AxiosResponse<any>> => {
    const response = await axios.get(
      `${BASE_URL}/sessions/${sessionId}/history`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  },

  sendMessage: async (
    token: string,
    sessionId: string,
    question: string,
    documentName: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ask`,
        {
          session_id: sessionId,
          document_name: documentName,
          question: question,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        answer: response.data.answer,
        user_id: response.data.user_id,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};

export default chats;
