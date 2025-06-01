import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/home";
import History from "./pages/History";
import NotFound from "./NotFound"; // Add your 404 component

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          {/* Video meet routes - be more specific if possible */}
          <Route path="/:url" element={<VideoMeet />} />
          {/* 404 catch-all route - must be last */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;