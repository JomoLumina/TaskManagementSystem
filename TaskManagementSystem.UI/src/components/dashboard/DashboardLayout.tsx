import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileModal from "../shared/ProfileModal";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (tab: string) => {
    navigate(`/dashboard/${tab}`);
  };

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <Box flex={1} display="flex" flexDirection="column">
        <TopNav
          onProfile={handleProfileClick}
          onLogout={handleLogout}
        />
        <Outlet />
        <ProfileModal
          open={profileModalOpen}
          onClose={handleCloseProfileModal}
          user={user!}
        />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
