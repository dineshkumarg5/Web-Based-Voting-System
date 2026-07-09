import "./App.css";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Polls from "./pages/Polls";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import CreatePoll from "./pages/CreatePoll";
import AddOptions from "./pages/AddOptions";
import EditPoll from "./pages/EditPoll";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* polls */}
        <Route path="/polls" element={<Polls />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/add-options/:id" element={<AddOptions />} />
        <Route path="/edit-poll/:id" element={<EditPoll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
