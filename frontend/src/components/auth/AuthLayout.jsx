import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError } from "../../redux/user/userSlice";

const AuthLayout = ({
  children,
  authSwitchLabel,
  authSwitchDesc,
  authSwitchLink,
  title,
  checkError,
  setCheckError,
}) => {
  const navigate = useNavigate();
  const { authError, currentUser, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        setCheckError(true);
        dispatch(clearAuthError());
      }, 4000);
    }
  }, [authError]);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      navigate("/news-by-tag");
    }
  }, [currentUser, isAuthenticated]);

  return (
    <Grid
      container
      gap={2}
      columns={2}
      sx={{
        display: "flex",
        height: "100vh",
        p: 3,
        zIndex: 10,
        flexDirection: { xs: "row", sm: "row", md: "column", lg: "column" },
        mt: 8,
      }}
    >
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Welcome to News App
          </Typography>
          <Typography variant="body">Share the News Experience</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
            px: 5,
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          {children}

          {authError !== null && !checkError ? (
            <Box sx={{ maxWidth: 250 }}>
              <Typography
                flexWrap={"wrap"}
                sx={{ m: 0, color: "red", fontSize: 17, fontWeight: 600 }}
              >
                {authError}
              </Typography>
            </Box>
          ) : null}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              fontSize: 15,
            }}
          >
            <Typography component={"span"} sx={{ fontSize: 17 }}>
              {authSwitchDesc}
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography
                component={Link}
                to={authSwitchLink}
                sx={{
                  textDecoration: "none",
                  color: "#1976d2",
                  ":hover": { textDecoration: "underline" },
                  fontSize: 17,
                }}
              >
                {authSwitchLabel}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
