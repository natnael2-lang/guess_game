import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./components/signUp/SignUpForm";
import Login from "./components/login/Login";
import Game from "./components/game/Game";
import {fetchWithAuth} from "./utilities/authCheck"

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5000/auth/check");
      setAuthenticated(res.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, []);
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authenticated ? <Navigate to="/game" /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
