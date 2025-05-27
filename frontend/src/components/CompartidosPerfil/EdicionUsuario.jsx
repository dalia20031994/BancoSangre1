// la parte encargada de la modificacion de los datos de usuario
import React from 'react';
import RegistroUsuario from '../Usuarios/RegistroUsuario';

const EdicionUsuario = ({ datosUsuario, setDatosUsuario, setFormularioValido }) => {
  return (
    <div className="h-full overflow-y-scroll space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Datos de Usuario</h2>
      <RegistroUsuario
        datosUsuario={datosUsuario}
        setDatosUsuario={setDatosUsuario}
        setFormularioValido={setFormularioValido}
        modoEdicion={true}
      />
    </div>
  );
};
export default EdicionUsuario;