import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../hooks/getUser";
import { authAction } from "../../hooks/authAction";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import MobileHeader from "./MobileHeader";
import MainHeader from "./MainHeader";
import DialogBox from "../dialog/Dialog";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = getUser();
  const { handleLogoutAuth, isAuthenticated } = authAction();
  const [handleOpen, setHandleOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await handleLogoutAuth().then(() => {
      navigate("/login");
    });
  };

  return (
    <Box sx={{ flexGrow: 1, zIndex: 50 }}>
      {isAuthenticated && (
        <DialogBox
          isOpen={handleOpen}
          handleLogout={handleLogout}
          setIsOpen={setHandleOpen}
          trigger={"logout"}
        />
      )}
      <CssBaseline />
      <AppBar>
        <Toolbar disableGutters sx={{ px: 1 }}>
          {/* mobile header view */}
          <MobileHeader
            open={open}
            toggleDrawer={toggleDrawer}
            setHandleOpen={setHandleOpen}
            navigate={navigate}
            currentUser={currentUser}
          />

          {/* main header view */}
          <MainHeader
            navigate={navigate}
            currentUser={currentUser}
            setHandleOpen={setHandleOpen}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
