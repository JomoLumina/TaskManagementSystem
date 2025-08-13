import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClient from "../../apiClient";
import { User } from "../../types/user";
import ProfileModal from "../shared/ProfileModal";
import LoadingProgress from "../loading/LoadingProgress";
import ConfirmModal from "../shared/ConfirmModel";

const UserRecords: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpen = (user: User) => {
    setUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUser(null);
  };

  const openConfirm = (id: string) => {
    setUserIdToDelete(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setUserIdToDelete(null);
    setConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/users/${userIdToDelete}`);
      setUsers((prev) => prev.filter((u) => u.id !== userIdToDelete));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <LoadingProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        User Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Created</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {moment(user.createdAt).format("MMMM Do YYYY, h:mm a")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(user)}
                      aria-label="view"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openConfirm(user.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ProfileModal open={open} onClose={handleClose} user={user} />
      <ConfirmModal
        open={confirmOpen}
        question="Are you sure you want to delete this user?"
        title="Confirm Deletion"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </Box>
  );
};

export default UserRecords;
