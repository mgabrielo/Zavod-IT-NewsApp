import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import AppDrawer from "../drawer/AppDrawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const MobileHeader = ({
  open,
  toggleDrawer,
  setHandleOpen,
  navigate,
  currentUser,
}) => {
  const theme = useTheme();
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", md: "none" },
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Drawer open={open} onClose={toggleDrawer(!open)}>
          <DrawerHeader>
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                width: "100%",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={toggleDrawer(!open)}
            >
              <Typography sx={{ fontWeight: "700", fontSize: 18 }}>
                Library App
              </Typography>
              <IconButton>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </Box>
          </DrawerHeader>
          <Divider />
          <AppDrawer
            toggleDrawer={toggleDrawer}
            handleDialogOpen={setHandleOpen}
            navigate={navigate}
            currentUser={currentUser}
          />
        </Drawer>
      </Box>
      <Box>
        <Typography
          component={Link}
          to={"/"}
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Library App Mobile
        </Typography>
      </Box>
    </Box>
  );
};

export default MobileHeader;
