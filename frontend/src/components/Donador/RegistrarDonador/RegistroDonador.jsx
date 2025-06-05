/*unir la validacion con los campos */
import React, { useEffect } from "react";
import CamposDonador from "../ModificarDonador/CamposDonador";
import { validarFormularioCompleto } from "../../../hooks/formulario/ValidacionesDonador";
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
        setErrores={setErrores}z
      />
    </div>
  );
};
export default RegistroDonador;