export const validarCampo = (name, value, erroresActuales) => {
  const regexTexto = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const regexTextoMinLength = /^.{3,}$/;
  const regexTelefono = /^[0-9]{10}$/;
  
  const nuevosErrores = { ...erroresActuales };

  // limpiar errores si el campo está vacío 
  if (!value && name !== 'telefonoDos') {
    nuevosErrores[name] = [];
    return nuevosErrores;
  }

  switch (name) {
    case 'nombre':
    case 'apellidoP':
    case 'apellidoM':
      nuevosErrores[name] = [];
      if (!regexTexto.test(value)) {
        nuevosErrores[name].push("Solo letras y espacios son permitidos.");
      }
      if (!regexTextoMinLength.test(value)) {
        nuevosErrores[name].push("El campo es muy corto.");
      }
      break;

    case 'edad':
      const edad = parseInt(value, 10);
      nuevosErrores.edad = isNaN(edad) || edad < 18 || edad > 64
        ? ["La edad debe ser entre 18 y 64 años."]
        : [];
      break;

    case 'peso':
      const peso = parseFloat(value);
      nuevosErrores.peso = isNaN(peso) || peso < 45 || peso > 150
        ? ["El peso debe estar entre 45 y 150 kg."]
        : [];
      break;

    case 'telefonoUno':
    case 'telefonoDos':
      if (value && !regexTelefono.test(value)) {
        nuevosErrores[name] = ["Debe contener 10 dígitos."];
      } else {
        nuevosErrores[name] = [];
      }
      break;

    default:
      nuevosErrores[name] = [];
  }

  return nuevosErrores;
};

export const validarFormularioCompleto = (datos, errores) => {
  const camposRequeridos = [
    'nombre', 'apellidoP', 'apellidoM', 'edad', 'peso', 'telefonoUno', 'tipoSangre'
  ];

  const camposValidos = camposRequeridos.every(
    campo => datos[campo] && !errores[campo]?.length
  );

  const telefonoValido = !datos.telefonoDos || (
    datos.telefonoDos && !errores.telefonoDos?.length
  );

  return camposValidos && telefonoValido;
};