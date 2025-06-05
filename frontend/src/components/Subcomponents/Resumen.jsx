// para mostrar el resumen
import React from 'react';
const Resumen = ({ datosUsuario, datosDonador, datosDireccion }) => {
  const formatCoord = (coord) => {
    if (coord === null || coord === undefined || isNaN(coord)) {
      return "N/D";
    }
    return typeof coord === 'number' ? coord.toFixed(6) : parseFloat(coord).toFixed(6);
  };
  const usuario = datosUsuario || {};
  const donador = datosDonador || {};
  const direccion = datosDireccion || {};
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded bg-gray-50 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos de Usuario</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Nombre de usuario:</p>
            <p>{usuario.nombre_usuario || "No ingresado"}</p> 
          </div>
          <div>
            <p className="font-medium">Correo electrónico:</p>
            <p>{usuario.correo || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Sexo:</p>
            <p>{usuario.sexo || "No ingresado"}</p>
          </div>
        </div>
      </div>
      <div className="p-4 border rounded bg-gray-50 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos Personales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Nombre:</p>
            <p>{donador.nombre || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Apellido Paterno:</p>
            <p>{donador.apellidoP || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Apellido Materno:</p>
            <p>{donador.apellidoM || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Edad:</p>
            <p>{donador.edad || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Tipo de Sangre:</p>
            <p>{donador.tipoSangre || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Peso:</p>
            <p>{donador.peso || "No ingresado"} kg</p>
          </div>
          <div>
            <p className="font-medium">Teléfono 1:</p>
            <p>{donador.telefonoUno || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Teléfono 2:</p>
            <p>{donador.telefonoDos || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Primera Donación:</p>
            <p>{donador.primeraDonacion || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Última Donación:</p>
            <p>{donador.ultimaDonacion || "No ingresado"}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded bg-gray-50 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos de Ubicación</h3>
        {Object.keys(direccion).length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Municipio:</p>
              <p>{direccion.municipio || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Colonia:</p>
              <p>{direccion.colonia || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Calle:</p>
              <p>{direccion.calle || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Número Exterior:</p>
              <p>{direccion.numeroExterior || "No ingresado"}</p>
            </div>
            {direccion.numeroInterior && (
              <div>
                <p className="font-medium">Número Interior:</p>
                <p>{direccion.numeroInterior}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="font-medium">Ubicación:</p>
              <p>
                {direccion.latitud !== null && direccion.longitud !== null
                  ? `Lat: ${formatCoord(direccion.latitud)}, Lng: ${formatCoord(direccion.longitud)}`
                  : "No definida"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No se han ingresado datos de dirección aún</p>
        )}
      </div>
    </div>
  );
};
export default Resumen;