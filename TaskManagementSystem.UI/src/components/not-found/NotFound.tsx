import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import NotFoundImage from "../../assets/images/404.svg";


const NotFound: React.FC = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid className="not-found-root" flexDirection={"column"} container minHeight={"100vh"}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <div className="big-error">
          <Typography
            variant={mobileDevice ? "h4" : "h2"}
            color="primary"
            className="not-found-title"
          >
            Page Not Found
          </Typography>
          <Typography
            variant={mobileDevice ? "body1" : "h5"}
            className="not-found-message"
          >
            The page you are looking for does not exist.
          </Typography>
        </div>
      </Box>

      <Box mt={3} display="flex" justifyContent="center">
        <img
          alt="Page not found"
          className="not-found-image"
          src={NotFoundImage}
        />
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Button
          component={RouterLink}
          to="/"
          className="back-home-btn"
        >
          Back to Home
        </Button>
      </Box>
    </Grid>
  );
};

export default NotFound;
