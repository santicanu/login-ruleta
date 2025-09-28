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

function Registro({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dni: null,
    age: null,
    areaCode: "",
    phone: "",
    email: "",
    answer1: "", 
    answer2: "", 
    answer3: "", 
    answer4: [], 
    prize_won: "un beso"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    console.log(form);
    try {
       await axios.post("http://192.168.0.12:8000/api/v1/participants", form);
      if (onSuccess) onSuccess();
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
          Registro de Participante
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
            label="DNI"
            name="dni"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.dni}
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
            ¿Sabías sobre las pinturas MIKSA antes de este evento?
          </Typography>
          <RadioGroup
            name="answer1"
            value={form.answer1}
            onChange={handleRadio}
            row
          >
            <FormControlLabel value={true} control={<Radio />} label="Sí" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>

          {/* Answer 2 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Alguna vez has comprado/utilizado productos Miksa?
          </Typography>
          <RadioGroup
            name="answer2"
            value={form.answer2}
            onChange={handleRadio}
            row
          >
            <FormControlLabel value={true} control={<Radio />} label="Sí" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>

          {/* Answer 3 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Con qué frecuencia sueles comprar este tipo de producto?
          </Typography>
          <RadioGroup
            name="answer3"
            value={form.answer3}
            onChange={handleRadio}
          >
            <FormControlLabel
              value="everyYear"
              control={<Radio />}
              label="Cada año"
            />
            <FormControlLabel
              value="every2Years"
              control={<Radio />}
              label="Cada 2 años"
            />
            <FormControlLabel
              value="every5YearsOrMore"
              control={<Radio />}
              label="Cada 5 años o más"
            />
          </RadioGroup>

          {/* Answer 4 */}
          <Typography sx={{ fontSize: '1.2rem', mt: 2 }}>
            ¿Qué valoras más al elegir una marca como Miksa? (Elige hasta 2)
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("competitivePrice")}
                  onChange={handleCheckboxGroup}
                  value="competitivePrice"
                  disabled={
                    !form.answer4.includes("competitivePrice") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Precio competitivo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("productQuality")}
                  onChange={handleCheckboxGroup}
                  value="productQuality"
                  disabled={
                    !form.answer4.includes("productQuality") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Calidad del producto"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("innovation")}
                  onChange={handleCheckboxGroup}
                  value="innovation"
                  disabled={
                    !form.answer4.includes("innovation") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Innovación / nuevas soluciones"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("stockAvailable")}
                  onChange={handleCheckboxGroup}
                  value="stockAvailable"
                  disabled={
                    !form.answer4.includes("stockAvailable") &&
                    form.answer4.length >= 2
                  }
                />
              }
              label="Stock disponible en tienda"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.answer4.includes("recommendedByProfessional")}
                  onChange={handleCheckboxGroup}
                  value="recommendedByProfessional"
                  disabled={
                    !form.answer4.includes("recommendedByProfessional") &&
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
    </Box>
  );
}

export default Registro;
