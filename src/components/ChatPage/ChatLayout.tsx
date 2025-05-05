import { Outlet } from "react-router-dom";
import { NavLink } from "react-router";
import { FileText, LogOut, PlusIcon, Loader2 } from "lucide-react";
import {
  format,
  isToday,
  isYesterday,
  subDays,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ChatSession } from "../../types";
import Accordion from "../Accordion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useChat } from "../../contexts/ChatContext";
import { useEffect, useState } from "react";
import Logo from "../../assets/AI-Apex-Logo-Color.png";

export default function ChatLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { logout, userName, token } = useAuth();
  console.log("userName", userName);

  const { getSessions, sessionList } = useChat();

  useEffect(() => {
    async function fetchSessions() {
      if (token) {
        setIsLoading(true);
        await getSessions(token);
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, [token]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categorizeSessions = (sessions: ChatSession[]) => {
    const categories: Record<string, ChatSession[]> = {
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      "Last 14 days": [],
      "Last 21 days": [],
      "Last 28 days": [],
    };

    const monthlyCategories: Record<string, ChatSession[]> = {};

    const now = new Date();

    sessions?.forEach((session) => {
      const sessionDate = parseISO(session.last_updated);

      if (isToday(sessionDate)) {
        categories["Today"].push(session);
      } else if (isYesterday(sessionDate)) {
        categories["Yesterday"].push(session);
      } else if (
        isWithinInterval(sessionDate, { start: subDays(now, 7), end: now })
      ) {
        categories["Last 7 days"].push(session);
      } else if (
        isWithinInterval(sessionDate, {
          start: subDays(now, 14),
          end: subDays(now, 8),
        })
      ) {
        categories["Last 14 days"].push(session);
      } else if (
        isWithinInterval(sessionDate, {
          start: subDays(now, 21),
          end: subDays(now, 15),
        })
      ) {
        categories["Last 21 days"].push(session);
      } else if (
        isWithinInterval(sessionDate, {
          start: subDays(now, 28),
          end: subDays(now, 22),
        })
      ) {
        categories["Last 28 days"].push(session);
      } else {
        const monthYear = format(sessionDate, "MMMM yyyy");
        if (!monthlyCategories[monthYear]) {
          monthlyCategories[monthYear] = [];
        }
        monthlyCategories[monthYear].push(session);
      }
    });

    return { categories, monthlyCategories };
  };

  const { categories, monthlyCategories } = categorizeSessions(sessionList);

  return (
    <div className="h-screen w-screen absolute top-0 left-0 flex overflow-hidden bg-gray-100">
      <div className="h-full flex flex-col w-full max-w-[300px] border border-r border-gray-300 bg-white">
        <div className="p-3 w-full">
          <img
            src={Logo}
            alt="Logo"
            className="rounded-md h-[65px] object-fill w-full"
          />
        </div>

        <NavLink to="/chat" className="px-3">
          <div className="flex font-poppins items-center justify-between w-full bg-gray-200 py-2 px-3 rounded text-themeGray-30 text-lg font-sans font-medium">
            Chat History
            <button
              type="button"
              data-tooltip-id="new-chat"
              data-tooltip-content="New chat"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
            </button>
          </div>
        </NavLink>

        <div className="flex-1 overflow-auto">
          <div className="px-3 min-h-44 py-1 mt-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                {Object.entries(categories).map(
                  ([category, sessions]) =>
                    sessions.length > 0 && (
                      <Accordion
                        key={category}
                        title={category}
                        children={
                          <div className="overflow-hidden w-full">
                            {sessions.map((session) => (
                              <NavLink
                                key={session.session_id}
                                to={`/chat/${session.session_id}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? "w-fulltext-themeGray-30 last:mb-2 justify-start text-sm font-normal h-10 bg-custom-green  rounded  flex items-center overflow-hidden"
                                    : "w-full text-themeGray-30 last:mb-2 justify-start font-normal text-sm h-10 hover:bg-custom-green hover:text-themeGray-30 rounded flex items-center overflow-hidden"
                                }
                              >
                                <span className="truncate px-3 flex items-center gap-3 w-full ">
                                  <span className="w-fit">
                                    <FileText size={20} />
                                  </span>
                                  <span className="w-full line-clamp-1 truncate">
                                    {session.session_id}
                                  </span>
                                </span>
                              </NavLink>
                            ))}
                          </div>
                        }
                      />
                    )
                )}

                {Object.entries(monthlyCategories).map(
                  ([month, sessions]) =>
                    sessions.length > 0 && (
                      <Accordion
                        key={month}
                        title={month}
                        children={
                          <div className="overflow-hidden w-full">
                            {sessions.map((session) => (
                              <NavLink
                                key={session.session_id}
                                to={`/main/${session.session_id}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? "w-fulltext-themeGray-30 last:mb-2 justify-start text-sm font-normal h-10 bg-custom-green  rounded  flex items-center overflow-hidden"
                                    : "w-full text-themeGray-30 last:mb-2 justify-start font-normal text-sm h-10 hover:bg-custom-green hover:text-themeGray-30 rounded flex items-center overflow-hidden"
                                }
                              >
                                <span className="truncate px-4 flex items-center gap-3 w-full ">
                                  <span className="w-fit">
                                    <FileText size={20} />
                                  </span>
                                  <span className="w-full  truncate">
                                    {session.session_name}
                                  </span>
                                </span>
                              </NavLink>
                            ))}
                          </div>
                        }
                      />
                    )
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-3">
          <div className="flex font-poppins items-center w-full px-3 relative bg-gray-100 border border-gray-300 mt-2 py-3 rounded-lg gap-2">
            <Avatar>
              <AvatarImage alt={"useIcon"} />
              <AvatarFallback className="bg-blue-500 text-white">
                {userName &&
                  userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5 w-full">
              <p className="text-base font-medium capitalize text-black">
                {userName}
              </p>
              <span className="text-sm font-normal text-black">User</span>
            </div>

            <div className="items-center gap-2 justify-end flex">
              <button onClick={handleLogout} className="text-black">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 h-full">
        <Outlet />
      </main>
    </div>
  );
}
