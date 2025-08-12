import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../context/AuthContext";

type TopNavProps = {
  onProfile: (id: string) => void;
  onLogout: () => void;
};

const TopNav: React.FC<TopNavProps> = ({ onProfile, onLogout }) => {
  const { user } = useAuth();
  const username = user!.username;
  const id = user!.id;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ ml: 4 }}>
            Task Management System
          </Typography>
          <Box flexGrow={1} />
          <IconButton color="inherit" onClick={handleMenuOpen} size="large">
            <Avatar sx={{ mr: 1 }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography variant="body1">{username}</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onProfile(id);
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
