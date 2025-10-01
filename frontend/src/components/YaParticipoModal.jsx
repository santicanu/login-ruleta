import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide } from "@mui/material";
import { forwardRef } from "react";

// Animación de slide desde abajo
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function YaParticipoModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          bgcolor: "#f5f7fa",
          textAlign: "center",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#2c5364", fontSize: { xs: 20, sm: 24 } }}>
        🎉 ¡Ya participaste! 🎉
      </DialogTitle>
    </Dialog>
  );
}

export default YaParticipoModal;