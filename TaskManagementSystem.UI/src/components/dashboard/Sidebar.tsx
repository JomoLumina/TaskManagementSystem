import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  ListItemButton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import InsertFileIcon from "@mui/icons-material/InsertDriveFile";

type SidebarProps = {
  onLogout: () => void;
  onNavigate: (tab: "users" | "tasks" | "any-url") => void;
  open?: boolean;
};

const drawerWidth = 220;

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  onNavigate,
  open = true,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        width: isOpen ? drawerWidth : 0,
        transition: "width 0.3s",
        flexShrink: 0,
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "absolute",
          top: 16,
          left: isOpen ? drawerWidth + 8 : 8,
          zIndex: 1300,
          transition: "left 0.3s",
        }}
      >
        <MenuIcon htmlColor="#ffffff" />
      </IconButton>
      <Box>
        <Drawer
          variant="persistent"
          anchor="left"
          open={isOpen}
          sx={{
            width: drawerWidth,
            transition: "width 0.24s",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isOpen ? drawerWidth : 0,
              background: "#9c27b0",
              color: "#ffffff",
              boxSizing: "border-box",
            },
          }}
        >
          <Box display="flex" flexDirection="column" height="100%">
            <Box p={2}>
              <Typography variant="h6" align="center">
                Menu
              </Typography>
            </Box>
            <Divider className="divider" />

            <List>
              <ListItemButton onClick={() => onNavigate("tasks")}>
                <ListItemIcon>
                  <AssignmentIcon htmlColor="white" />
                </ListItemIcon>
                <ListItemText primary="Tasks" />
              </ListItemButton>
              <ListItemButton onClick={() => onNavigate("users")}>
                <ListItemIcon>
                  <PeopleIcon htmlColor="white" />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
              <ListItemButton onClick={() => onNavigate("any-url")}>
                <ListItemIcon>
                  <InsertFileIcon htmlColor="white" />
                </ListItemIcon>
                <ListItemText primary="Page Not Found" />
              </ListItemButton>
            </List>
            <Box flexGrow={1} />
            <Divider className="divider" />
            <List>
              <ListItemButton onClick={onLogout}>
                <ListItemIcon>
                  <LogoutIcon htmlColor="white" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;
