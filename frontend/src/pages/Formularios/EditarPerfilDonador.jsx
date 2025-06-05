// la vista y gestion de la edicion de perfil
import React, { useState, useRef } from "react";
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import ConfirmarModal from '../../components/Modales/ConfirmarModal';
import MensajeExito from '../../components/Modales/MensajeExito';
import Indicador from '../../components/Subcomponents/Indicador'; 
import Resumen from '../../components/Subcomponents/Resumen'; 
import EdicionUsuario from '../../components/Usuarios/EdicionUsuario';
import EdicionDonador from '../../components/Donador/ModificarDonador/EdicionDonador';
import EdicionDireccion from '../../components/Direccion/ModificarDireccion/EdicionDireccion';
import usarEdicionPerfilDonador from "../../hooks/perfil/Donador/usarEdicionPerfilDonador";
import logicaActualizar from "../../hooks/formulario/logicaActualizar";
import gestionarPasos from "../../hooks/formulario/gestionarPasos";

const EditarPerfilDonador = () => {
  const { nombreRol } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [usuarioValido, setUsuarioValido] = useState(false);
  const [formularioDonadorValido, setFormularioDonadorValido] = useState(false);
  const [direccionValida, setDireccionValida] = useState(true);
  const [direccionModificada, setDireccionModificada] = useState(false);
  const [datosDireccion, setDatosDireccion] = useState(null); 
  const direccionRef = useRef(); 
  const {
    esValidoRol,
    idDonador,
    idDireccion,
    idUsuario,
    datosUsuario,
    setDatosUsuario,
    datosDonador,
    setDatosDonador,
    datosDireccionOriginales,
    direccionState,
    setDireccionState
  } = usarEdicionPerfilDonador(setMensaje);
  const { handleActualizarPerfil, actualizacionEnProgreso } = logicaActualizar(
    idUsuario,
    datosUsuario,
    idDonador,
    datosDonador,
    idDireccion,
    datosDireccion,
    direccionModificada,
    direccionValida,
    setMensaje,
    (newId) => {
        setDireccionState(prev => ({ ...prev, id: newId }));
    }
  );
  const {
    paso,
    siguientePaso,
    regresarPaso,
    mostrarConfirmacion,
    confirmarActualizacion,
    cancelarActualizacion
  } = gestionarPasos({
    usuarioValido,
    formularioDonadorValido,
    direccionModificada,
    direccionRef,
    direccionValida
  }, setMensaje);
  if (esValidoRol === false) {
    return <Navigate to="/" />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Diálogo de confirmación */}
      {mostrarConfirmacion && (
        <ConfirmarModal
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas actualizar tu perfil con los datos proporcionados?"
          onConfirm={() => handleActualizarPerfil(navigate, nombreRol)}
          onCancel={cancelarActualizacion}
          isProcessing={actualizacionEnProgreso}
        />
      )}
      {/* Contenido principal del formulario */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="text-xl font-semibold mb-4 text-center">
          Editar Perfil de Donador
        </div>
        {/* Indicador de pasos */}
        <Indicador currentStep={paso} totalSteps={4} /> 
        <MensajeExito message={mensaje} />
        {/* Contenido de cada paso */}
        <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg overflow-auto">
          <div className="h-120 overflow-auto">
            {paso === 1 && (
              <EdicionUsuario
                datosUsuario={datosUsuario}
                setDatosUsuario={setDatosUsuario}
                setFormularioValido={setUsuarioValido}
              />
            )}
            {paso === 2 && (
              <EdicionDonador
                datosDonador={datosDonador}
                setDatosDonador={setDatosDonador}
                setFormularioValido={setFormularioDonadorValido}
              />
            )}
            {paso === 3 && (
              <EdicionDireccion
                direccionRef={direccionRef}
                direccionState={direccionState}
                setDatosDireccion={setDatosDireccion}
                setDireccionModificada={setDireccionModificada}
                setDireccionValida={setDireccionValida}
                datosDireccionOriginales={datosDireccionOriginales}
              />
            )}
            {paso === 4 && (
              <Resumen
                datosUsuario={datosUsuario}
                datosDonador={datosDonador}
                datosDireccion={datosDireccion || datosDireccionOriginales}
              />
            )}
          </div>
          {/* botones de navegación */}
          <div className="flex justify-center mt-4 space-x-4">
            {paso > 1 && (
              <button
                onClick={regresarPaso}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Regresar
              </button>
            )}
            {paso < 4 ? (
              <button
                onClick={siguientePaso}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600`}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={confirmarActualizacion}
                disabled={actualizacionEnProgreso}
                className={`px-4 py-2 bg-teal-800 text-white rounded hover:bg-green-600 ${actualizacionEnProgreso ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {actualizacionEnProgreso ? 'Procesando...' : 'Confirmar Cambios'}
              </button>
            )}
          </div>
        </div>
       </div>
      </div>
  );
};
export default EditarPerfilDonador;
