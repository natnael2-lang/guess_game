import SignUpForm from "./components/signUp/SignUpForm.jsx";
import  {LoginForm} from "./components/login/Login.jsx";
import Game from "./components/game/Game.jsx"
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function routes() {
  return (
    <Router>
    
        <Routes>
          {/* Default route goes to Sign Up */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Sign Up Page */}
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/game" element={<Game/>} />

          

         

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
                404 | Page Not Found
              </div>
            }
          />
        </Routes>
    
    </Router>
  );
}

export default routes;