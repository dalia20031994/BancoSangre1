/*unir la validacion con los campos */
import React, { useEffect } from "react";
import CamposDonador from "./CamposDonador";
import { validarFormularioCompleto } from "./ValidacionesDonador";

const RegistroDonador = ({
  datosDonador,
  setDatosDonador,
  setFormularioValido,
}) => {
  const [errores, setErrores] = React.useState({
    nombre: [],
    apellidoP: [],
    apellidoM: [],
    edad: [],
    telefonoUno: [],
    telefonoDos: [],
    peso: [],
    tipoSangre: [],
    primeraDonacion: [],
    ultimaDonacion: []
  });

  // validar formulario completo
  useEffect(() => {
    const valido = validarFormularioCompleto(datosDonador, errores);
    setFormularioValido(valido);
  }, [datosDonador, errores, setFormularioValido]);

  return (
    <div className="space-y-4">
      <CamposDonador
        datosDonador={datosDonador}
        setDatosDonador={setDatosDonador}
        errores={errores}
        setErrores={setErrores}
      />
    </div>
  );
};

export default RegistroDonador;