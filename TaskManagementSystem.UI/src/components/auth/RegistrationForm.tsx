import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { authApi } from "../../apiClient";
import PasswordField from "../shared/PasswordField";
import Header from "../shared/Header";

type RegistrationFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Password validation rules
 *  Minimum 6 characters, at least one uppercase letter, one lowercase letter, and one special character.
 *  */
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

const schema = yup
  .object({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        passwordRules,
        "Password must be at least 6 characters, include uppercase, lowercase and a symbol"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();

const RegistrationForm: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authApi.register(data);
      if (response.status === 200) {
        const { token, user } = response.data;
        auth.login(token, user);
        navigate("/");
      }else{
        throw new Error("Registration failed, please try again.");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="registration-container">
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="registration-form"
      >
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Register
        </Typography>
        <Divider className="divider" sx={{ mt: 1 }} />

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <TextField
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          fullWidth
          className="white-text-field"
          disabled={loading}
        />

        <TextField
          label="Email Address"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
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

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          className="white-text-field"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
        <Divider className="divider" />
        <Typography textAlign="center">
          <Link component={RouterLink} to="/login" color="secondary" underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
