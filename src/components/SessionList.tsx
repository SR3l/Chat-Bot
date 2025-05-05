import React from 'react';
import { Session } from '../types';
import { FileText } from 'lucide-react';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { isWithinInterval } from 'date-fns/isWithinInterval';

interface SessionListProps {
  sessions: Session[];
  selectedSession: Session | null;
  onSelectSession: (session: Session) => void;
}

const SessionList: React.FC<SessionListProps> = ({ 
  sessions, 
  selectedSession, 
  onSelectSession 
}) => {
  const categorizeSessions = (sessions: Session[]) => {
    const categories: Record<string, Session[]> = {
      Today: [],
      Yesterday: [],
      'Last 7 days': [],
      'Last 14 days': [],
      'Last 21 days': [],
      'Last 28 days': [],
    };
    const monthlyCategories: Record<string, Session[]> = {};
    const now = new Date();

    sessions?.forEach((session) => {
      // Use last_updated if available, otherwise fall back to created_at
      const dateToUse = session.last_updated || session.created_at;
      const sessionDate = parseISO(dateToUse);
  

      if (isToday(sessionDate)) {
        categories['Today'].push(session);
      } else if (isYesterday(sessionDate)) {
        categories['Yesterday'].push(session);
      } else if (isWithinInterval(sessionDate, { start: subDays(now, 7), end: now })) {
        categories['Last 7 days'].push(session);
      } else if (isWithinInterval(sessionDate, { start: subDays(now, 14), end: subDays(now, 8) })) {
        categories['Last 14 days'].push(session);
      } else if (isWithinInterval(sessionDate, { start: subDays(now, 21), end: subDays(now, 15) })) {
        categories['Last 21 days'].push(session);
      } else if (isWithinInterval(sessionDate, { start: subDays(now, 28), end: subDays(now, 22) })) {
        categories['Last 28 days'].push(session);
      } else {
        const monthYear = format(sessionDate, 'MMMM yyyy');
        if (!monthlyCategories[monthYear]) {
          monthlyCategories[monthYear] = [];
        }
        monthlyCategories[monthYear].push(session);
      }
    });

    return { categories, monthlyCategories };
  };

  const { categories, monthlyCategories } = categorizeSessions(sessions || []);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-gray-500">
        No chat sessions found
      </div>
    );
  }

  return (
    <div className="px-3 max-h-80 min-h-44 py-1 mt-1 overflow-y-auto scrollbar-thin">
      {Object.entries(categories).map(([category, sessions]) => 
        sessions.length > 0 && (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-medium mb-2">{category}</h3>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => onSelectSession(session)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded ${
                    selectedSession?.session_id === session.session_id
                      ? 'bg-custom-green text-themeGray-30'
                      : 'hover:bg-custom-green hover:text-themeGray-30 text-themeGray-30'
                  }`}
                >
                  <FileText size={20} />
                  <span className="truncate">
                    {session.document_name || `Chat ${session.session_id.slice(0, 8)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {Object.entries(monthlyCategories).map(([month, sessions]) => 
        sessions.length > 0 && (
          <div key={month} className="mb-4">
            <h3 className="text-sm font-medium mb-2">{month}</h3>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => onSelectSession(session)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded ${
                    selectedSession?.session_id === session.session_id
                      ? 'bg-custom-green text-themeGray-30'
                      : 'hover:bg-custom-green hover:text-themeGray-30 text-themeGray-30'
                  }`}
                >
                  <FileText size={20} />
                  <span className="truncate">
                    {session.document_name || `Chat ${session.session_id.slice(0, 8)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SessionList; 