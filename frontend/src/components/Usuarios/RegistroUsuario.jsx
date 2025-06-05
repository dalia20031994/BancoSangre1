/*unir la validacion con los campos */
import React, { useEffect } from "react";
import CamposUsuario from "./CamposUsuario";
import { validarFormularioCompleto } from "../../hooks/perfil/Usuario/ValidacionesUsuario";

const RegistroUsuario = ({
  datosUsuario,
  setDatosUsuario,
  setFormularioValido,
}) => {
  const [errores, setErrores] = React.useState({
    nombre_usuario: [],
    correo: [],
    sexo: [],
    password: [],
    password_confirmation: [],
  });
  // validar formulario completo
  useEffect(() => {
    const valido = validarFormularioCompleto(datosUsuario, errores);
    setFormularioValido(valido);
  }, [datosUsuario, errores, setFormularioValido]);

  return (
    <div className="space-y-4">
      <CamposUsuario
        datosUsuario={datosUsuario}
        setDatosUsuario={setDatosUsuario}
        errores={errores}
        setErrores={setErrores}
      />
    </div>
  );
};

export default RegistroUsuario;