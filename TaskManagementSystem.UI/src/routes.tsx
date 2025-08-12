import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/loading/LoadingScreen";
import TaskBoard from "./components/tasks/TaskBoard";

// Lazy-loaded components
const LoginForm = lazy(() => import("./components/users/LoginForm"));
const RegistrationForm = lazy(() => import("./components/users/RegistrationForm"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const TaskList = lazy(() => import("./components/tasks/TaskList"));
const NotFound = lazy(() => import("./components/not-found/NotFound"));

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Suspense
      fallback={<LoadingScreen />}
    >
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegistrationForm />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="tasks" element={<TaskBoard />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/dashboard/tasks" : "/login"} replace />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
