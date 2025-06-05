// la parte encargada de la modificacion de los datos de donador
import RegistroDonador from '../RegistrarDonador/RegistroDonador'; 

const EdicionDonador = ({ datosDonador, setDatosDonador, setFormularioValido }) => {
  return (
    <div className="h-full overflow-y-scroll space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
      <RegistroDonador
        datosDonador={datosDonador}
        setDatosDonador={setDatosDonador}
        setFormularioValido={setFormularioValido}
        modoEdicion={true}
      />
    </div>
  );
};
export default EdicionDonador;