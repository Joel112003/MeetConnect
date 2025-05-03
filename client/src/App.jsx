import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/home";
import History from "./pages/History";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<Home />} />

            <Route path="/history" element={<History />} />
            <Route path="/:url" element={<VideoMeet />} />

            {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} /> */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
