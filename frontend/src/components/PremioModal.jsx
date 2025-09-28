import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide } from "@mui/material";
import { forwardRef } from "react";

// Animación de slide desde abajo
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PremioModal({ open, onClose, premio }) {
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
        🎉 ¡Felicidades! 🎉
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: { xs: 16, sm: 18 }, mt: 1, color: "#011627" }}>
          Ganaste: <strong>{premio}</strong>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#2c5364",
            "&:hover": { bgcolor: "#203a43" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PremioModal;
