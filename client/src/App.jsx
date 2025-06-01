import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/home";
import History from "./pages/History";
import NotFound from "./NotFound";

// Private Route component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to auth page with the location they were trying to access
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          
          {/* Protected routes */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
          
          {/* Video meet route with specific pattern */}
          <Route path="/meeting/:url" element={
            <PrivateRoute>
              <VideoMeet />
            </PrivateRoute>
          } />
          
          {/* 404 catch-all route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
