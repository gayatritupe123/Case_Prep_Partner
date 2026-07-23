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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/cases" element={<CaseLibrary />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/find-partner" element={<FindPartner />} />
          <Route path="/sessions" element={<MySessions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
