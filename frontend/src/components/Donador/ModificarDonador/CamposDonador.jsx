import CampoTexto from "./Campos/CampoTexto";
import CampoNumero from "./Campos/CampoNumero";
import CampoFecha from "./Campos/CampoFecha";
import CampoSelect from "./Campos/CampoSelect";
import {validarCampo} from "../../../hooks/formulario/ValidacionesDonador"
const CamposDonador = ({ datosDonador, setDatosDonador, errores, setErrores }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nuevosErrores = validarCampo(name, value, errores);
    setErrores(nuevosErrores);
    setDatosDonador(prev => ({ ...prev, [name]: value }));
  };
  const estaDeshabilitado = (campo, camposPrevios) => {
    if (!camposPrevios) return false;
    const campos = Array.isArray(camposPrevios) ? camposPrevios : [camposPrevios];
    return !campos.every(campo => datosDonador[campo] && !errores[campo]?.length);
  };

  return (
    <>
      <CampoTexto
        label="Nombre"
        name="nombre"
        required
        value={datosDonador.nombre}
        onChange={handleInputChange}
        errores={errores.nombre}
      />
      <CampoTexto
        label="Apellido paterno"
        name="apellidoP"
        required
        disabled={estaDeshabilitado('apellidoP', 'nombre')}
        value={datosDonador.apellidoP}
        onChange={handleInputChange}
        errores={errores.apellidoP}
      />
      <CampoTexto
        label="Apellido materno"
        name="apellidoM"
        required
        disabled={estaDeshabilitado('apellidoM', 'apellidoP')}
        value={datosDonador.apellidoM}
        onChange={handleInputChange}
        errores={errores.apellidoM}
      />
      <CampoNumero
        label="Edad"
        name="edad"
        required
        min={18}
        max={64}
        disabled={estaDeshabilitado('edad', 'apellidoM')}
        value={datosDonador.edad}
        onChange={handleInputChange}
        errores={errores.edad}
        placeholder="Entre 18 y 64 años"
      />
      <CampoFecha
        label="Primera donación"
        name="primeraDonacion"
        disabled={estaDeshabilitado('primeraDonacion', 'edad')}
        value={datosDonador.primeraDonacion}
        onChange={handleInputChange}
        errores={errores.primeraDonacion}
      />
      <CampoFecha
        label="Última donación"
        name="ultimaDonacion"
        disabled={estaDeshabilitado('ultimaDonacion', 'edad')}
        value={datosDonador.ultimaDonacion}
        onChange={handleInputChange}
        errores={errores.ultimaDonacion}
      />
      <CampoSelect
        label="Tipo de sangre"
        name="tipoSangre"
        required
        options={[
          "", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
        ]}
        disabled={estaDeshabilitado('tipoSangre', 'edad')}
        value={datosDonador.tipoSangre}
        onChange={handleInputChange}
        errores={errores.tipoSangre}
      />
      <CampoNumero
        label="Peso (kg)"
        name="peso"
        required
        step="0.1"
        min={45}
        max={150}
        disabled={estaDeshabilitado('peso', 'tipoSangre')}
        value={datosDonador.peso}
        onChange={handleInputChange}
        errores={errores.peso}
        placeholder="Ejemplo: 70.5"
      />
      <CampoTexto
        label="Teléfono principal"
        name="telefonoUno"
        required
        type="tel"
        maxLength="10"
        disabled={estaDeshabilitado('telefonoUno', 'peso')}
        value={datosDonador.telefonoUno}
        onChange={handleInputChange}
        errores={errores.telefonoUno}
        placeholder="10 dígitos"
      />
      <CampoTexto
        label="Teléfono secundario"
        name="telefonoDos"
        type="tel"
        maxLength="10"
        disabled={estaDeshabilitado('telefonoDos', 'telefonoUno')}
        value={datosDonador.telefonoDos}
        onChange={handleInputChange}
        errores={errores.telefonoDos}
        placeholder="Opcional"
      />
    </>
  );
};
export default CamposDonador;
