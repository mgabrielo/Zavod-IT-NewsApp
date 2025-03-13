import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { drawerItems } from "./DrawerItems";

const AppDrawer = ({
  toggleDrawer,
  handleDialogOpen,
  navigate,
  currentUser,
}) => {
  const filteredDrawerItems = currentUser
    ? drawerItems.filter((item) => !["Login", "Register"].includes(item.label))
    : drawerItems.filter((item) => item.label !== "News By Tag");
  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {filteredDrawerItems.map((item, index) => {
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
        {currentUser && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleDialogOpen(true)}>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default AppDrawer;
