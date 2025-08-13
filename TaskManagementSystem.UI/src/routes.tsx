import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/loading/LoadingScreen";
import LoadingProgress from "./components/loading/LoadingProgress";

// Lazy-loaded components
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegistrationForm = lazy(
  () => import("./components/auth/RegistrationForm")
);
const DashboardLayout = lazy(
  () => import("./components/dashboard/DashboardLayout")
);
const TaskList = lazy(() => import("./components/tasks/TaskRecords"));
const TaskBoard = lazy(() => import("./components/tasks/TaskBoard"));
const UserRecords = lazy(() => import("./components/users/UserRecords"));
const NotFound = lazy(() => import("./components/not-found/NotFound"));

const AppRoutes: React.FC = () => {
  const { isLoggedIn, isAdmin, authChecked } = useAuth();
  if (!authChecked) {
    return <LoadingProgress />;
  }
  return (
    <Suspense fallback={<LoadingScreen />}>
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
          <Route index element={<TaskBoard />} />
         
          <Route
            path="users"
            element={isAdmin ? <UserRecords /> : <NotFound />}
          />
          <Route
            path="tasks"
            element={isAdmin ? <TaskList /> : <NotFound />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
