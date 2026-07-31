import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import CaseLibrary from "./pages/CaseLibrary";
import CaseDetail from "./pages/CaseDetail";
import FindPartner from "./pages/FindPartner";
import MySessions from "./pages/MySessions";
import NotificationBell from "./components/NotificationBell";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }} />

      <div className="navbar">
        <div className="navbar-inner">
          <div className="brand">CasePrep<span>Partner</span></div>
          <div className="nav-links" style={{ alignItems: "center" }}>
            <Link to="/cases">Case Library</Link>
            <Link to="/find-partner">Find Partner</Link>
            <Link to="/sessions">My Sessions</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <NotificationBell />
          </div>
        </div>
      </div>

      <div className="page">
        <Routes>
        <Route path="/" element={<Navigate to="/cases" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/cases" element={<ProtectedRoute><CaseLibrary /></ProtectedRoute>} />
        <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
        <Route path="/find-partner" element={<ProtectedRoute><FindPartner /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
