import React from 'react';
import { ChatEntry } from '../types';

interface ChatHistoryProps {
  history: ChatEntry[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {history.map((entry, index) => (
        <div key={index} className="mb-4">
          <div className="bg-gray-100 p-3 rounded mb-2">
            <p className="font-medium">You:</p>
            <p>{entry.question}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-medium">Assistant:</p>
            <p>{entry.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 