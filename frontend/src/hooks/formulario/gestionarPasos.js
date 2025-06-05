// se encarga de manejor los pasos para la edicion de perfil
import { useState } from 'react';

const gestionarPasos = (validations, setMensaje) => {
  const [paso, setPaso] = useState(1);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const siguientePaso = () => {
    if (paso === 1 && !validations.usuarioValido) {
      setMensaje({ texto: "Por favor completa correctamente los datos de usuario", tipo: "error" });
      return;
    }
    if (paso === 2 && !validations.formularioDonadorValido) {
      setMensaje({ texto: "Por favor completa correctamente los datos personales", tipo: "error" });
      return;
    }
    if (paso === 3 && validations.direccionModificada && (!validations.direccionRef.current || !validations.direccionRef.current.isValid())) {
      setMensaje({ texto: "Por favor completa correctamente los datos de dirección", tipo: "error" });
      return;
    }
    setMensaje({ texto: '', tipo: '' }); 
    setPaso(prevPaso => prevPaso + 1);
  };
  const regresarPaso = () => {
    setMensaje({ texto: '', tipo: '' }); 
    if (paso > 1) setPaso(prevPaso => prevPaso - 1);
  };
  const confirmarActualizacion = () => {
    if (paso === 1 && !validations.usuarioValido) {
      setMensaje({ texto: "Por favor completa correctamente los datos de usuario", tipo: "error" });
      return;
    }
    if (paso === 2 && !validations.formularioDonadorValido) {
      setMensaje({ texto: "Por favor completa correctamente los datos personales", tipo: "error" });
      return;
    }
    if (paso === 3 && validations.direccionModificada && (!validations.direccionRef.current || !validations.direccionRef.current.isValid())) {
      setMensaje({ texto: "Por favor completa correctamente los datos de dirección", tipo: "error" });
      return;
    }
    setMostrarConfirmacion(true);
  };
  const cancelarActualizacion = () => setMostrarConfirmacion(false);
  return {
    paso,
    siguientePaso,
    regresarPaso,
    mostrarConfirmacion,
    confirmarActualizacion,
    cancelarActualizacion,
    setPaso 
  };
};

export default gestionarPasos;