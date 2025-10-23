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
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
} from "@mui/material";
import YaParticipoModal from "./YaParticipoModal";

function Registro({ onSuccess, setParticipante }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: null,
    areaCode: "",
    phone: "",
    email: "",
    answer1: null, 
    answer2: null, 
    answer3: "", 
    answer4: [], 
    prize_won: ""
  });
  const [openParticipoModal, setOpenParticipoModal] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;
  let parsedValue = value;

  setForm({ ...form, [name]: parsedValue });
};

const handleRadio = (e) => {
  const { name, value } = e.target;

  // Si el valor es "true"/"false", convertir a boolean
  if (value === "true" || value === "false") {
    setForm({ ...form, [name]: value === "true" });
  } else {
    setForm({ ...form, [name]: value });
  }
};
const handleCheckboxGroup = (e) => {
  const { value, checked } = e.target;
  let newArr = [...form.answer4];
  if (checked) {
    if (newArr.length < 2) newArr.push(value);
  } else {
    newArr = newArr.filter((v) => v !== value);
  }
  setForm({ ...form, answer4: newArr });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://login-ruleta-1.onrender.com/api/participants", form);
      if (res.data.success === false && res.data.message === "Email already registered") {
        setOpenParticipoModal(true);
        return;
      } else{
        onSuccess();
        setParticipante(res.data.id);
      }
    } catch (err) {
      console.error(err);
    }
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
          Registro de participantes
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="firstName"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Apellido"
            name="lastName"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Edad"
            name="age"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.age}
            onChange={handleChange}
            required
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <TextField
            label="Código de área"
            name="areaCode"
            sx={{ width: '30%' }}
            margin="normal"
            variant="outlined"
            value={form.areaCode}
            onChange={handleChange}
            required
          />
          <TextField
            label="Teléfono"
            name="phone"
            margin="normal"
            variant="outlined"
            value={form.phone}
            onChange={handleChange}
            required
          />
          </Box>
          <TextField
            label="Correo"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Answer 1 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Conocías las pinturas Miksa antes de este evento?
          </Typography>
          <RadioGroup
            name="answer1"
            value={form.answer1}
            onChange={handleRadio}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Sí" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Answer 2 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Alguna vez compraste o utilizaste productos Miksa?
          </Typography>
          <RadioGroup
            name="answer2"
            value={form.answer2}
            onChange={handleRadio}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Sí" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Answer 3 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Con qué frecuencia solés comprar este tipo de producto?
          </Typography>
          <RadioGroup
            name="answer3"
            value={form.answer3}
            onChange={handleRadio}
          >
            <FormControlLabel
              value="Cada año"
              control={<Radio />}
              label="Cada año"
            />
            <FormControlLabel
              value="Cada 2 años"
              control={<Radio />}
              label="Cada 2 años"
            />
            <FormControlLabel
              value="Cada 5 años o más"
              control={<Radio />}
              label="Cada 5 años o más"
            />
          </RadioGroup>

          {/* Answer 4 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Qué valorás más al elegir una marca como Miksa? (Podés elegir hasta 2 opciones)
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("Precio competitivo")}
                  onChange={handleCheckboxGroup}
                  value="Precio competitivo"
                  disabled={
                    !form.answer4.includes("Precio competitivo") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Precio competitivo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("Calidad del producto")}
                  onChange={handleCheckboxGroup}
                  value="Calidad del producto"
                  disabled={
                    !form.answer4.includes("Calidad del producto") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Calidad del producto"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("Innovación / nuevas soluciones")}
                  onChange={handleCheckboxGroup}
                  value="Innovación / nuevas soluciones"
                  disabled={
                    !form.answer4.includes("Innovación / nuevas soluciones") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Innovación / nuevas soluciones"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("Stock disponible en tienda")}
                  onChange={handleCheckboxGroup}
                  value="Stock disponible en tienda"
                  disabled={
                    !form.answer4.includes("Stock disponible en tienda") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Stock disponible en tienda"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("Recomendado por un profesional/arquitecto de confianza")}
                  onChange={handleCheckboxGroup}
                  value="Recomendado por un profesional/arquitecto de confianza"
                  disabled={
                    !form.answer4.includes("Recomendado por un profesional/arquitecto de confianza") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Recomendado por un profesional/arquitecto de confianza"
            />
          </FormGroup>

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
      <YaParticipoModal open={openParticipoModal} onClose={() => setOpenParticipoModal(false)} />
    </Box>
  );
}

export default Registro;
