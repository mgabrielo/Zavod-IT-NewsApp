import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DialogBox({
  isOpen,
  handleLogout,
  setIsOpen,
  handleNewsDelete,
  trigger,
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  const handleAction = (e) => {
    if (trigger == "logout") {
      handleLogout(e);
      handleClose();
    } else if (trigger == "deleteNews") {
      const closed = true;
      handleNewsDelete({ e, closed });
      handleClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {trigger == "logout" && "Do You Want to Sign out ?"}
          {trigger === "deleteNews" && "Do You Want To Delete This News"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {trigger == "logout" && "Are You Sure You Want to Sign out ?"}
            {trigger === "deleteNews" &&
              "Are You Sure You Want To Delete This News"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleAction} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
