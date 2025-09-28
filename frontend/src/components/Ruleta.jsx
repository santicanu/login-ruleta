// Ruleta.jsx
import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Box, Button, Typography } from "@mui/material";
import "./Ruleta.css";
const backgroundColors = [
  "#ff0000ff", // Kit El Galgo – rojo suave
  "#006affff", // Lapicera – azul brillante
  "#01ffbbff", // Libreta – verde menta
  "#ff00ddff", // Cuellito – rosa vibrante
  "#ffcc00ff", // Chaleco – amarillo dorado
  "#ff9500ff", // Tabla – naranja
  "#00d5ffff", // Taza – celeste
  "#492f6dff", // Vino – morado
  "#637a91ff", // Gracias por participar – gris azulado
];
function Ruleta({ opciones, onResult }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = opciones.map(op => ({ option: op.texto }));

  const girar = () => {
    if (mustSpin) return;

    // lógica simple de probabilidades
    const disponibles = opciones.filter((op) => op.ocurrencias < op.max);
    const total = disponibles.reduce((acc, op) => acc + op.probabilidad, 0);
    let rnd = Math.random() * total;
    let elegido = disponibles[0];
    for (let op of disponibles) {
      if (rnd < op.probabilidad) {
        elegido = op;
        break;
      }
      rnd -= op.probabilidad;
    }

    const index = data.findIndex((d) => d.option === elegido.texto);
    setPrizeNumber(index);
    setMustSpin(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "90vw",
        margin: "0 auto",
        textAlign: "center",
        mt: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        ¡Exitos!
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: { xs: "320px", sm: "450px", md: "520px", lg: "600px" },
            maxWidth: "100vw",
            paddingTop: "100%" // para mantener proporción cuadrada
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    maxWidth: 500, 
                    margin: "0 auto",
                }}
            >
                <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={backgroundColors}
                textColors={["#000000ff"]}
                radiusLineColor="#ffffffff"
                radiusLineWidth={2}
                fontSize={16}         
                fontWeight="500"    
                fontStyle="normal"      
                textDistance={59}       
                outerBorderColor="#ffffffff"
                outerBorderWidth={6}
                innerRadius={15}
                innerBorderColor="#ffffffff"
                innerBorderWidth={4}
                pointerProps={{
                  src: './puntero.png',
                }}
                onStopSpinning={() => {
                    setMustSpin(false);
                    onResult(opciones[prizeNumber]);
                    opciones[prizeNumber].ocurrencias += 1;
                }}
                />
            </Box>
            {/* <Box
              sx={{
              position: "absolute",
              top: -40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 30,
              height: 30,
              bgcolor: "#ffde59",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" // flecha triangular
              }}
          /> */}
          </Box>
        </Box>
      </Box>

      <Button
        onClick={girar}
        disabled={mustSpin}
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "#2c5364",
          "&:hover": { bgcolor: "#203a43" },
          borderRadius: 2,
          padding: "12px 24px",
          fontWeight: "bold",
          textTransform: "none",
          fontSize: { xs: 14, sm: 16 },
        }}
      >
        {mustSpin ? "Girando..." : "Girar"}
      </Button>
    </Box>
  );
}

export default Ruleta;
