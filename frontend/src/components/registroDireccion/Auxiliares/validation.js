/*realiza las validaciones para los campos de municipio */
/*que sea un numero */
export const validarNumero = (numero) => {
  return numero === 'S/N' || /^[0-9]+$/.test(numero);
};
/*que se ingrese un municipio valido*/
export const validarMunicipio = (label, municipios) => {
  if (!label.trim()) return { valido: false, error: "Campo obligatorio" };

  const coincidenciaExacta = municipios.find(m =>
    m.label.toLowerCase() === label.toLowerCase()
  );

  if (coincidenciaExacta) return { valido: true, municipio: coincidenciaExacta };
/*manejar las sugerencias de municipio */
  const sugerencias = municipios.filter(m =>
    m.label.toLowerCase().includes(label.toLowerCase())
  );

  return {
    valido: false,
    error: sugerencias.length ? "Seleccione una sugerencia" : "Municipio no encontrado",
    sugerencias
  };
};