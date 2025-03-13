import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const MainHeader = ({ navigate, currentUser, setHandleOpen }) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          px: 1,
        }}
      >
        <Typography
          component={Link}
          to={"/news"}
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          News App
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <Button
          onClick={() => navigate("/news")}
          sx={{
            color: "inherit",
            fontSize: 17,
            textTransform: "capitalize",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          News
        </Button>
        <Button
          onClick={() => navigate("/news")}
          sx={{
            color: "inherit",
            fontSize: 17,
            textTransform: "capitalize",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          News
        </Button>
        {!currentUser ? (
          <>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </>
        ) : (
          <Box sx={{ width: "100%", display: "flex" }}>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
                ":hover": {
                  textDecoration: "underline",
                },
                width: 150,
              }}
              onClick={() => navigate("/news-by-tag")}
            >
              News By Tag
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
                ":hover": {
                  textDecoration: "underline",
                },
                width: 150,
              }}
              onClick={() => navigate("/create-news")}
            >
              Create News
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
                ":hover": {
                  textDecoration: "underline",
                },
                width: 150,
              }}
              onClick={() => navigate("/statistics")}
            >
              Statistics
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "capitalize",
                fontSize: 17,
              }}
              onClick={() => setHandleOpen(true)}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MainHeader;
