import { useState, useEffect } from "react";
import axios from "axios";
import Registro from "./Registro"; // el form de antes
import Ruleta from "./Ruleta";
import PremioModal from "./PremioModal";

function AppRuleta() {
  const [registrado, setRegistrado] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [premio, setPremio] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [participante, setParticipante] = useState(null);

  useEffect(() => {
      const fetchPrizes = async () => {
        try {
          const response = await axios.get("https://login-ruleta-1.onrender.com/api/prizes/");
          const formattedOpciones = response.data.map((prize) => ({
            id: prize.id,
            name: prize.name,
            probability: prize.probability,
            maxOcurrency: prize.maxOcurrency,
            ocurrency: prize.ocurrency,
          }));
          setOpciones(formattedOpciones);
        } catch (error) {
          console.error("Error fetching prizes:", error);
        }
      };
      fetchPrizes();
    
  }, []);

  const handleResult = async (opcionGanadora) => {
    await axios.put(`https://login-ruleta-1.onrender.com/api/participants/${participante}/updatePrize`, opcionGanadora);
    setPremio(opcionGanadora.name);
    setModalOpen(true);
  };

  return (
    <>
      {!registrado ? (
        <Registro onSuccess={() => setRegistrado(true)} setParticipante={setParticipante} />
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
        premio={premio}
      />
    </>
  );
}

export default AppRuleta;