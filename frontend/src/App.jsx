import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import Skeleton from "./components/common/Skeleton";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const VideoMeet = lazy(() => import("./pages/VideoMeet"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const MeetRedirect = lazy(() => import("./pages/MeetRedirect"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const RouteLoader = () => <Skeleton type="page" srLabel="Loading route" />;


function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="/videomeet"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <VideoMeet />
              </SocketProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meet/:code"
          element={
            <ProtectedRoute>
              <MeetRedirect />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
