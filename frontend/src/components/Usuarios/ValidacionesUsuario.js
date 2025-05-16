export const validarCampo = (name, value, datos, erroresActuales) => {
  const nuevosErrores = { ...erroresActuales };

  const regexTexto = /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9_]+$/; // permite letras, números y guiones bajos
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexNombreUsuario = /^[\p{L}_]+$/u;

  // Limpiar errores si está vacío (permitido para password)
  if (!value && name !== "password" && name !== "password_confirmation") {
    nuevosErrores[name] = [];
    return nuevosErrores;
  }

  switch (name) {
    case "nombre_usuario":
      nuevosErrores[name] = [];
      if (!regexNombreUsuario.test(value)) {
        nuevosErrores[name].push(
          "No se permiten números ni otros caracteres especiales."
        );
      }
      if (value.length < 3) {
        nuevosErrores[name].push("Debe tener al menos caracteres.");
      }
      break;

    case "correo":
      nuevosErrores[name] = [];
      if (!regexCorreo.test(value)) {
        nuevosErrores[name].push("Correo no válido.");
      }
      break;

    case "sexo":
      nuevosErrores[name] = [];
      if (!["masculino", "femenino", "otro"].includes(value.toLowerCase())) {
        nuevosErrores[name].push("Sexo no válido.");
      }
      break;

    case "password":
    case "password_confirmation":
      nuevosErrores.password = [];
      nuevosErrores.password_confirmation = [];

      const pass1 = datos.password || "";
      const pass2 = datos.password_confirmation || "";

      if (pass1) {
        const passwordErrors = [
          [pass1.length < 8 || pass1.length > 15, "Debe tener 8-15 caracteres"],
          [!/[a-z]/.test(pass1), "Al menos una minúscula"],
          [!/[A-Z]/.test(pass1), "Al menos una mayúscula"],
          [!/[0-9]/.test(pass1), "Al menos un número"],
          [!/[!@#$%^&*]/.test(pass1), "Al menos un símbolo (!@#$%^&*)"],
        ]
          .filter(([condition]) => condition)
          .map(([_, msg]) => msg);

        nuevosErrores.password.push(...passwordErrors);
      }

      if (pass2 && pass1 !== pass2) {
        nuevosErrores.password_confirmation.push(
          "Las contraseñas no coinciden."
        );
      }
      break;

    default:
      nuevosErrores[name] = [];
  }

  return nuevosErrores;
};

export const validarFormularioCompleto = (datos, errores) => {
  const camposRequeridos = ["nombre_usuario", "correo", "sexo"];

  const camposValidos = camposRequeridos.every(
    (campo) => datos[campo]?.trim() && errores[campo]?.length === 0
  );

  // Passwords pueden estar vacíos, pero si hay datos deben ser válidos
  const passwordValida =
    (!datos.password && !datos.password_confirmation) ||
    (errores.password?.length === 0 &&
      errores.password_confirmation?.length === 0);

  return camposValidos && passwordValida;
};
