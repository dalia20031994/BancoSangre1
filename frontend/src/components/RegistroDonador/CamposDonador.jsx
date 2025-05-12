/*la estructura del formulario de los campos*/
import React from "react";
import { ErrorMessage } from "../ErrorMessage";

const CamposDonador = ({ datosDonador, setDatosDonador, errores, setErrores }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nuevosErrores = validarCampo(name, value, errores);
    setErrores(nuevosErrores);
    setDatosDonador(prev => ({ ...prev, [name]: value }));
  };

  //para ver si un campo debe estar deshabilitado
  const estaDeshabilitado = (campo, camposPrevios) => {
    if (!camposPrevios) return false;
    const campos = Array.isArray(camposPrevios) ? camposPrevios : [camposPrevios];
    return !campos.every(campo => datosDonador[campo] && !errores[campo]?.length);
  };

  return (
    <>
      {/* Campo del nombre */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={datosDonador.nombre || ""}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50"
          placeholder="Escribe tu nombre"
        />
        {errores.nombre?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de apellido paterno */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Apellido paterno <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="apellidoP"
          value={datosDonador.apellidoP || ""}
          disabled={estaDeshabilitado('apellidoP', 'nombre')}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="Escribe tu apellido paterno"
        />
        {errores.apellidoP?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de apellido materno */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Apellido materno <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="apellidoM"
          value={datosDonador.apellidoM || ""}
          disabled={estaDeshabilitado('apellidoM', 'apellidoP')}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="Escribe tu apellido materno"
        />
        {errores.apellidoM?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de edad */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Edad <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="edad"
          value={datosDonador.edad || ""}
          disabled={estaDeshabilitado('edad', 'apellidoM')}
          onChange={handleInputChange}
          min="18"
          max="64"
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="Entre 18 y 64 años"
        />
        {errores.edad?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de primera donación */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Primera donación
        </label>
        <input
          type="date"
          name="primeraDonacion"
          value={datosDonador.primeraDonacion || ""}
          disabled={estaDeshabilitado('primeraDonacion', 'edad')}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
        />
        {errores.primeraDonacion?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de ultima donación */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Última donación
        </label>
        <input
          type="date"
          name="ultimaDonacion"
          value={datosDonador.ultimaDonacion || ""}
          disabled={estaDeshabilitado('ultimaDonacion', 'edad')}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
        />
        {errores.ultimaDonacion?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de tipo de sangre */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Tipo de sangre <span className="text-red-500">*</span>
        </label>
        <select
          name="tipoSangre"
          value={datosDonador.tipoSangre || ""}
          disabled={estaDeshabilitado('tipoSangre', 'edad')}
          onChange={handleInputChange}
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
        >
          <option value="">Selecciona una opción</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        {errores.tipoSangre?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* campo de peso */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Peso (kg) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="peso"
          value={datosDonador.peso || ""}
          disabled={estaDeshabilitado('peso', 'tipoSangre')}
          onChange={handleInputChange}
          step="0.1"
          min="45"
          max="150"
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="Ejemplo: 70.5"
        />
        {errores.peso?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo de teléfono principal */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Teléfono principal <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="telefonoUno"
          value={datosDonador.telefonoUno || ""}
          disabled={estaDeshabilitado('telefonoUno', 'peso')}
          onChange={handleInputChange}
          maxLength="10"
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="10 dígitos"
        />
        {errores.telefonoUno?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>

      {/* Campo teléfono secundario */}
      <div>
        <label className="block text-sm font-bold text-teal-700">
          Teléfono secundario
        </label>
        <input
          type="tel"
          name="telefonoDos"
          value={datosDonador.telefonoDos || ""}
          disabled={estaDeshabilitado('telefonoDos', 'telefonoUno')}
          onChange={handleInputChange}
          maxLength="10"
          className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
          placeholder="Opcional"
        />
        {errores.telefonoDos?.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
    </>
  );
};

// Funcion de validación 
const validarCampo = (name, value, erroresActuales) => {
  const regexTexto = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const regexTextoMinLength = /^.{3,}$/;
  const regexTelefono = /^[0-9]{10}$/;
  
  const nuevosErrores = { ...erroresActuales };

  // limpiar errores si el campo está vacío (excepto campos opcionales)
  if (!value && !['telefonoDos', 'primeraDonacion', 'ultimaDonacion'].includes(name)) {
    nuevosErrores[name] = [];
    return nuevosErrores;
  }

  switch (name) {
    case 'nombre':
    case 'apellidoP':
    case 'apellidoM':
      nuevosErrores[name] = [];
      if (value && !regexTexto.test(value)) {
        nuevosErrores[name].push("Solo letras y espacios son permitidos.");
      }
      if (value && !regexTextoMinLength.test(value)) {
        nuevosErrores[name].push("Mínimo 3 caracteres.");
      }
      break;

    case 'edad':
      const edad = parseInt(value, 10);
      nuevosErrores.edad = !value || isNaN(edad) || edad < 18 || edad > 64
        ? ["Debe ser entre 18 y 64 años."]
        : [];
      break;

    case 'peso':
      const peso = parseFloat(value);
      nuevosErrores.peso = !value || isNaN(peso) || peso < 45 || peso > 150
        ? ["Debe estar entre 45 y 150 kg."]
        : [];
      break;

    case 'telefonoUno':
      nuevosErrores.telefonoUno = !value || !regexTelefono.test(value)
        ? ["Debe contener 10 dígitos."]
        : [];
      break;

    case 'telefonoDos':
      nuevosErrores.telefonoDos = value && !regexTelefono.test(value)
        ? ["Debe contener 10 dígitos."]
        : [];
      break;

    case 'tipoSangre':
      nuevosErrores.tipoSangre = !value
        ? ["Selecciona un tipo de sangre."]
        : [];
      break;

    default:
      nuevosErrores[name] = [];
  }

  return nuevosErrores;
};

export default CamposDonador;