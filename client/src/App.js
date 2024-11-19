import React from "react";
import LandingNavbar from "./components/LandingNavbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import EmailRegister from "./pages/emailregister";
import EmailLogin from "./pages/emaillogin";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/emailregister" element={<EmailRegister />} />
        <Route exact path="/emaillogin" element={<EmailLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
