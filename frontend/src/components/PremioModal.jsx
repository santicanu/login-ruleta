import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide } from "@mui/material";
import { forwardRef } from "react";

// Animación de slide desde abajo
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PremioModal({ open, premio }) {
  return (
    <Dialog
      open={open}
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
      <DialogTitle
        sx={{ fontWeight: "bold", color: "#2c5364", fontSize: { xs: 20, sm: 24 } }}
      >
        {premio === "¡Gracias por jugar!" ? "¡Estuvo cerca! 🥲" : "🎉 ¡Felicidades! 🎉"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: { xs: 16, sm: 18 }, mt: 1, color: "#011627" }}>
          {premio === "¡Gracias por jugar!" ? (
            "Gracias por jugar con Miksa!"
          ) : (
            <>
              Ganaste: <strong>{premio}</strong>
            </>
          )}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default PremioModal;
