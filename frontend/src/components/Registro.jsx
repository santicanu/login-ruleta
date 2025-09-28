import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";

function Registro({ onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    telefono: "",
    correo: "",
    yaCompro: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, yaCompro: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   await axios.post("http://localhost:8000/api/participantes", form);

      // ejecutar callback pasado desde AppRuleta
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);}
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          bgcolor: "#f5f7fa",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#2c5364" }}
        >
          Registro de Participante
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <TextField
            label="Apellido"
            name="apellido"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.apellido}
            onChange={handleChange}
            required
          />
          <TextField
            label="Edad"
            name="edad"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.edad}
            onChange={handleChange}
            required
          />
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          <TextField
            label="Correo"
            name="correo"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.correo}
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.yaCompro}
                onChange={handleCheckbox}
                sx={{ color: "#2c5364" }}
              />
            }
            label="Ya compró en Miksa"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#2c5364",
              "&:hover": { bgcolor: "#203a43" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Registrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Registro;
