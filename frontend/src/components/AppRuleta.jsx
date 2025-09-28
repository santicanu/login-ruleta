import { useState, useEffect } from "react";
import axios from "axios";
import Registro from "./Registro"; // el form de antes
import Ruleta from "./Ruleta";
import PremioModal from "./PremioModal";

function AppRuleta() {
  const [registrado, setRegistrado] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [premio, setPremio] = useState(null);
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    if (registrado) {
      const fetchPrizes = async () => {
        try {
          const response = await axios.get("http://192.168.0.12:8000/api/prizes/");
          const formattedOpciones = response.data.map((prize) => ({
            texto: prize.name,
            probabilidad: prize.probability,
            max: prize.maxOcurrency,
            ocurrencias: prize.ocurrency,
          }));
          setOpciones(formattedOpciones);
        } catch (error) {
          console.error("Error fetching prizes:", error);
        }
      };
      fetchPrizes();
    }
  }, [registrado]);

  const handleResult = (opcionGanadora) => {
    setPremio(opcionGanadora.texto);
    setModalOpen(true);
  };

  return (
    <>
      {!registrado ? (
        <Registro onSuccess={() => setRegistrado(true)} />
      ) : opciones.length > 0 ? (
        <Ruleta
          opciones={opciones}
          onResult={handleResult}
        />
      ) : (
        <p>Cargando premios...</p>
      )}

      <PremioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        premio={premio}
      />
    </>
  );
}

export default AppRuleta;