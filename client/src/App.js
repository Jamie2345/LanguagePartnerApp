import React from "react";
import LandingNavbar from "./components/LandingNavbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import EmailRegister from "./pages/emailregister";
import EmailLogin from "./pages/emaillogin";
import Home from "./pages/home";
import Lengua from "./pages/lengua";

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
      </Routes>
    </Router>
  );
}

export default App;
