import { useEffect, useState } from "react";
import useAuthCheck from "./hooks/useAuthCheck";
import { instance as axios } from "./utils/axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import PageNotFound from "./pages/PageNotFound";
import "./App.css";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const { auth, loading, refreshAuth } = useAuthCheck();
  if (loading) return <div>Loading...</div>;
  return auth ? children : <Navigate to="/login" replace />;
}

// PublicRoute component to prevent access to login/register if authenticated
function PublicRoute({ children }) {
  const { auth, loading, refreshAuth } = useAuthCheck();
  if (loading) return <div>Loading...</div>;
  return !auth ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <div className="max-h-screen bg-gray-50 overflow-x-hidden hide-scrollbar">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/createpost" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/post/:id" element={<PrivateRoute><Post /></PrivateRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path="/profile/:username" element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
