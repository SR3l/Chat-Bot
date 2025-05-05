import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import Signup from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';
import ChatLayout from './components/ChatPage/ChatLayout';
import ChatDetailsPage from './components/ChatPage/ChatDetailsPage';
import { ToastContainer } from 'react-toastify';
import { ChatProvider } from './contexts/ChatContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem('token'); // Just for the test puspose
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Chat />} />
              <Route path=":slug" element={<ChatDetailsPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/chat" />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
