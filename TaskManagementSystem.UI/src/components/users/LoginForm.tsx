import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Link,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authApi } from "../../apiClient";
import PasswordField from "../shared/PasswordField";
import Header from "../shared/Header";

export type LoginFormInputs = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authApi.login(data);
      if (response.status === 200) {
        const { token, user } = response.data;
        auth.login(token, user);
        navigate("/");
      }else if(response.status === 401){
        throw new Error("Invalid login credentials");
      }else{
        throw new Error("Login failed, please try again.");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="login-form"
      >
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Login
        </Typography>

        <Divider className="divider" sx={{ mb: 1 }} />

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <TextField
          label="Username"
          {...register("username")}
          color="primary"
          error={!!errors.username}
          helperText={errors.username?.message}
          fullWidth
          className="white-text-field"
          disabled={loading}
        />
        <PasswordField
          register={register}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1, borderRadius: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        <Divider className="divider" sx={{ mt: 1 }} />
        <Typography textAlign="center">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
