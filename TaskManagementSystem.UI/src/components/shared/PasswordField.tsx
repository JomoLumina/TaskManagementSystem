import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField: React.FC<{
  register: any;
  name?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}> = ({ register, name, label, error, helperText, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword((show) => !show);

  return (
    <TextField
      label={label || "Password"}
      type={showPassword ? "text" : "password"}
      {...register(name || "password")}
      error={error}
      helperText={helperText}
      fullWidth
      color="secondary"
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleToggle}
              edge="end"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
