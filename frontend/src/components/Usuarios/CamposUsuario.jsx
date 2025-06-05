import { ErrorMessage } from "../Errores/ErrorMessage";
import { validarCampo } from "../../hooks/perfil/Usuario/ValidacionesUsuario";
const CamposUsuario = ({ datosUsuario, setDatosUsuario, errores, setErrores }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nuevosErrores = validarCampo(name, value, datosUsuario, errores);
    setErrores(nuevosErrores);
    setDatosUsuario(prev => ({ ...prev, [name]: value }));
  };
  return (
    <>
      {/* Campo nombre de usuario */}
      <div>
        <label className="block text-sm font-bold text-teal-700">Nombre de usuario <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="nombre_usuario"
          value={datosUsuario.nombre_usuario || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500"
          placeholder="Escribe tu nombre de usuario"
        />
        {errores.nombre_usuario?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
      {/* Campo correo */}
      <div>
        <label className="block text-sm font-bold text-teal-700"> Correo electrónico <span className="text-red-500">*</span></label>
        <input
          type="email"
          name="correo"
          value={datosUsuario.correo || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500"
          placeholder="usuario@ejemplo.com"
        />
        {errores.correo?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
      {/* Campo sexo */}
      <div>
        <label className="block text-sm font-bold text-teal-700">Sexo <span className="text-red-500">*</span></label>
        <select
          name="sexo"
          value={datosUsuario.sexo || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500"
        >
          <option value="">Selecciona una opción</option>
          <option value="M">Masculino</option> 
          <option value="F">Femenino</option> 
        </select>
        {errores.sexo?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
      {/* Campo contraseña */}
      <div>
        <label className="block text-sm font-bold text-teal-700">Contraseña</label>
        <input
          type="password"
          name="password"
          value={datosUsuario.password || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500"
          placeholder="Opcional"
        />
        {errores.password?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
      {/* Confirmación de contraseña */}
      <div>
        <label className="block text-sm font-bold text-teal-700">Confirmar contraseña</label>
        <input
          type="password"
          name="password_confirmation"
          value={datosUsuario.password_confirmation || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500"
          placeholder="Repite la contraseña"
        />
        {errores.password_confirmation?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
    </>
  );
};
export default CamposUsuario;