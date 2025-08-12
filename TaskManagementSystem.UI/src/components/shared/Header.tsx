import React from 'react';
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
  return (
    <div className="header-root">
      <Typography
        variant="h1"
        component="h1"
        className="header-text">
        Task Management System
      </Typography>
    </div>
  );
};

export default Header;
