import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Box, Button, Typography } from "@mui/material";
import "./Ruleta.css";
import puntero from "../assets/puntero.png";
import logo from "../assets/Miksa.png";
import logoDigitActivo from "../assets/digitactivo.png";
import "../../index.css"; 

const backgroundColors = [
  "#f9b917",
  "#96C13D",
  "#db1f66",
  "#3d9fdb",
  "#BCBEC0",
  "#933489",
  "#FF5757",
];

function Ruleta({ opciones, onResult }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = opciones.map((op) => ({ option: op.name }));

  const girar = () => {
    if (mustSpin) return;

    const disponibles = opciones.filter(
      (op) => op.ocurrency < op.maxOcurrency
    );
    const total = disponibles.reduce((acc, op) => acc + op.probability, 0);
    let rnd = Math.random() * total;
    let elegido = disponibles[0];
    for (let op of disponibles) {
      if (rnd < op.probability) {
        elegido = op;
        break;
      }
      rnd -= op.probability;
    }

    const index = data.findIndex((d) => d.option === elegido.name);
    setPrizeNumber(index);
    setMustSpin(true);
  };

  return (
    <Box
      sx={{
        minHeight: "auto",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center", 
        alignItems: "center",
        width: "100%",
        maxWidth: "90vw",
        margin: "0 auto",
        textAlign: "center",
        mt: 1,
      }}
    >
      {/* Contenido principal */}
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          ¡Éxitos!
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
              width: { xs: 320, sm: 450, md: 520, lg: 600 },
              aspectRatio: "1 / 1",
              maxWidth: "100%",
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
                  radiusLineColor="#3a3a3aff"
                  radiusLineWidth={0}
                  fontSize={16}
                  fontWeight="700"
                  // fontFamily="DINPro"
                  textDistance={57}
                  outerBorderColor="#3a3a3aff"
                  outerBorderWidth={12}
                  innerRadius={0}
                  innerBorderColor="#3a3a3aff"
                  innerBorderWidth={35}
                  pointerProps={{
                    src: puntero,
                    style: { width: 100, height: 100 },
                  }}
                  onStopSpinning={() => {
                    setMustSpin(false);
                    onResult(opciones[prizeNumber]);
                    opciones[prizeNumber].ocurrencias += 1;
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Button
          onClick={girar}
          disabled={mustSpin}
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: "#2c5364",
            "&:hover": { bgcolor: "#203a43" },
            borderRadius: 2,
            padding: "12px 24px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: { xs: 14, sm: 16 },
          }}
        >
          {mustSpin ? 
          <Typography variant="body1" >Girando...</Typography> : 
          <Typography variant="body1" >Girar</Typography>}
        </Button>
      </Box>

      <Box
        component="footer"
        sx={{
          width: "100%",
          // py: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="Miksa Logo"
          style={{ marginTop: "20px", marginBottom: "0", maxHeight: "90px", width: "auto" }}
        />
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.875rem"}} >creado por</Typography>
          <img
            src={logoDigitActivo}
            alt="DigitActivo Logo"
            style={{ marginLeft: "0px", maxHeight: "110px", width: "auto" }}
          />
        </Box>
        
      </Box>
    </Box>
  );
}

export default Ruleta;
