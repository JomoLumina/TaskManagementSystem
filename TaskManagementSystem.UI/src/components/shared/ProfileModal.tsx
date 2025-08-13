import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Backdrop,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { User } from "../../types/user";

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
  user: User | null;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const _user = { ...user };
  delete _user.password;
  const userEntries = Object.entries(_user);
  const display = open ? "initial" : "none";
  return (
    <Box
      sx={{
        display: display,
        transition: "display 5s",
      }}
    >
      <Backdrop
        open={open}
        onClick={onClose}
        sx={{
          zIndex: (theme) => theme.zIndex.modal - 1,
          backfaceVisibility: "visible",
        }}
      />
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
          p: 3,
          zIndex: (theme) => theme.zIndex.modal,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="close profile modal"
            sx={{
              position: "absolute",
              right: "24px",
              top: "24px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>
            <Divider className="divider" sx={{borderColor: "#333 !important", marginBottom: 3}} />
        {userEntries.map(([key, value]) => (
          <React.Fragment key={key}>
            <Grid container spacing={1}>
              <Grid>
                <Typography fontWeight="bold" textTransform="capitalize">
                  {`${key.replace(/([A-Z])/g, " $1").trim()}:   `}
                </Typography>
              </Grid>
              <Grid>
                <Typography>{String(value)}</Typography>
              </Grid>
              <Divider className="divider"/>
            </Grid>
          </React.Fragment>
        ))}
      </Paper>
    </Box>
  );
};

export default ProfileModal;
