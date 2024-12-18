import React from "react";
import LandingNavbar from "./components/LandingNavbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import EmailRegister from "./pages/emailregister";
import EmailLogin from "./pages/emaillogin";
import Home from "./pages/home";
import Lengua from "./pages/lengua";
import Onboarding from "./pages/onboarding";

import Messages from "./pages/messages";
import MessagePage from "./pages/message";
import Profile from "./pages/profile";

import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emailregister" element={<EmailRegister />} />
        <Route path="/emaillogin" element={<EmailLogin />} />

        <Route
          path="/lengua"
          element={
            <AuthProvider>
              <Lengua />
            </AuthProvider>
          }
        />
        <Route
          path="/onboarding"
          element={
            <AuthProvider>
              <Onboarding />
            </AuthProvider>
          }
        />
        <Route
          path="/messages"
          element={
            <AuthProvider>
              <Messages />
            </AuthProvider>
          }
        />
        <Route
          path="/messages/:conversationId"
          element={
            <AuthProvider>
              <MessagePage />
            </AuthProvider>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthProvider>
              <Profile />
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
