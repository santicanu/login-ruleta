import { useState } from "react";
import Registro from "./Registro"; // el form de antes
import Ruleta from "./Ruleta";
import PremioModal from "./PremioModal";
function AppRuleta() {
  const [registrado, setRegistrado] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [premio, setPremio] = useState(null); 

  const opciones = [
    { texto: "Kit El Galgo", probabilidad: 3, max: 5, ocurrencias: 0 },
    { texto: "Lapicera", probabilidad: 2, max: 2, ocurrencias: 0 },
    { texto: "Libreta", probabilidad: 5, max: Infinity, ocurrencias: 0 },
    { texto: "Cuellito", probabilidad: 1, max: 1, ocurrencias: 0 },
    { texto: "Chaleco", probabilidad: 1, max: 1, ocurrencias: 0 },
    { texto: "Tabla", probabilidad: 1, max: 1, ocurrencias: 0 },
    { texto: "Taza", probabilidad: 7, max: Infinity, ocurrencias: 0 },
    { texto: "Vino", probabilidad: 80, max: Infinity, ocurrencias: 0 },
    { texto: "Gracias por participar", probabilidad: 70, max: Infinity, ocurrencias: 0 },
  ];

  const handleResult = (opcionGanadora) => {
    setPremio(opcionGanadora.texto);
    setModalOpen(true);
  };
  return (
    <>
      {!registrado ? (
        <Registro onSuccess={() => setRegistrado(true)} />
      ) : (
        <Ruleta
          opciones={opciones}
          onResult={handleResult}
        />
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