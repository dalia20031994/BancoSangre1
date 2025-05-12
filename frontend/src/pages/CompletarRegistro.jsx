/*aqui se llama al componente para registrar direccion y donador y se acomoda en pasos para rellenarlos cuando es el primer inicio de secion del usuario con rol donador */
import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Footer from "../components/Layout/Footer";
import RegistroDonador from "../components/RegistroDonador/RegistroDonador";
import RegistroDireccion from "../components/registroDireccion/RegistroDireccion";
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

const CompletarRegistro = () => {
  const { token } = useContext(AuthContext);
  const [paso, setPaso] = useState(1);
  const [formularioValido, setFormularioValido] = useState(false);
  const direccionRef = useRef();
  const [datosDireccion, setDatosDireccion] = useState(null);
  const [direccionValida, setDireccionValida] = useState(false);
  const [esValido, setEsValido] = useState(null);
  const { nombreRol } = useParams();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [registroEnProgreso, setRegistroEnProgreso] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();
/*datos de la direccion */
  const [direccionState, setDireccionState] = useState({
    municipioDetectadoPorGPS: false,
    municipioTocado: false,
    municipioValido: false,
    esMunicipioManual: false,
    colonia: "",
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    nombreMunicipio: "",
    latitud: null,
    longitud: null,
    estado: "Oaxaca",
    errores: {},
    sugerencias: []
  });
  /*datos del donador */
  const [datosDonador, setDatosDonador] = useState({
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    edad: "",
    primeraDonacion: "",
    ultimaDonacion: "",
    tipoSangre: "",
    peso: "",
    telefonoUno: "",
    telefonoDos: "",
    estado: true,
  });

  // para verificar si un municipio ya existe
  const verificarMunicipioExistente = async (nombreMunicipio) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/municipio/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.find(m => m.nombre.toLowerCase() === nombreMunicipio.toLowerCase())?.id || null;
    } catch (error) {
      console.error('Error al verificar municipio:', error);
      throw error;
    }
  };

  // Para crear un nuevo municipio
  const crearMunicipio = async (nombreMunicipio) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/municipio/',
        { nombre: nombreMunicipio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error al crear municipio:', error);
      throw error;
    }
  };

  // Para verificar si una colonia ya existe
  const verificarColoniaExistente = async (nombreColonia, municipioId) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/colonia/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.find(c => 
        c.nombre.toLowerCase() === nombreColonia.toLowerCase() && 
        c.municipio === municipioId
      )?.id || null;
    } catch (error) {
      console.error('Error al verificar colonia:', error);
      throw error;
    }
  };

  // para crear una nueva colonia
  const crearColonia = async (nombreColonia, municipioId) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/colonia/',
        { nombre: nombreColonia, municipio: municipioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error al crear colonia:', error);
      throw error;
    }
  };

  // para verificar si unas coordenadas ya existen
  const verificarCoordenadasExistentes = async (latitud, longitud) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/coordenada/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.find(coord => 
        Math.abs(coord.latitud - latitud) < 0.0001 && 
        Math.abs(coord.longitud - longitud) < 0.0001
      )?.id || null;
    } catch (error) {
      console.error('Error al verificar coordenadas:', error);
      throw error;
    }
  };

  // para crear nuevas coordenadas
  const crearCoordenadas = async (latitud, longitud) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/coordenada/',
        { latitud, longitud },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error al crear coordenadas:', error);
      throw error;
    }
  };

  // para crear una nueva dirección
  const crearDireccion = async (direccionData, coloniaId, coordenadasId) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/direccion/',
        {
          calle: direccionData.calle,
          numInterior: direccionData.numeroInterior || 0,
          numExterior: direccionData.numeroExterior,
          colonia: coloniaId,
          coordenadas: coordenadasId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error al crear dirección:', error);
      throw error;
    }
  };

  // Para registrar el donador
  const registrarDonador = async (donadorData, direccionId) => {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/donador/',
      {
        nombre: donadorData.nombre,
        apellidoP: donadorData.apellidoP,
        apellidoM: donadorData.apellidoM,
        edad: donadorData.edad,
        primeraDonacion: donadorData.primeraDonacion || "1900-01-01",
        ultimaDonacion: donadorData.ultimaDonacion ||"1900-01-01",
        tipoSangre: donadorData.tipoSangre,
        peso: donadorData.peso,
        estado: donadorData.estado,
        telefonoUno: donadorData.telefonoUno,
        telefonoDos: donadorData.telefonoDos || null,
        direccion: direccionId,
        usuario: idUsuario
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('--- ERROR DETALLADO DEL BACKEND ---');
    console.error('URL:', error.config.url);
    console.error('Método:', error.config.method);
    console.error('Datos enviados:', JSON.parse(error.config.data));
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Errores de validación:', error.response.data);
      
      // Si es un error de validación (400), muestra los campos con error
      if (error.response.status === 400) {
        console.error('Errores por campo:');
        for (const [field, errors] of Object.entries(error.response.data)) {
          console.error(`- ${field}:`, errors);
        }
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error('Request:', error.request);
    } else {
      console.error('Error al configurar la petición:', error.message);
    }
    
    throw error; 
  }
};

  // Para manejar el registro completo y que funcione de forma adecuada
  const handleRegistroCompleto = async () => {
    setMostrarConfirmacion(false);
    if (!formularioValido || !direccionValida || registroEnProgreso) {
      setMensaje({
        texto: "Por favor completa correctamente todos los pasos antes de enviar.",
        tipo: "error",
      });
      return;
    }

    setRegistroEnProgreso(true);
    setMensaje({ texto: 'Procesando registro...', tipo: 'info' });

    try {
      // Municipio
      const municipioId = await verificarMunicipioExistente(datosDireccion.municipio) || 
                         await crearMunicipio(datosDireccion.municipio);

      //Colonia
      const coloniaId = await verificarColoniaExistente(datosDireccion.colonia, municipioId) || 
                       await crearColonia(datosDireccion.colonia, municipioId);

      //Coordenadas
      const coordenadasId = await verificarCoordenadasExistentes(datosDireccion.latitud, datosDireccion.longitud) || 
                           await crearCoordenadas(datosDireccion.latitud, datosDireccion.longitud);

      //Dirección
      const direccionId = await crearDireccion(datosDireccion, coloniaId, coordenadasId);

      //Donador
      await registrarDonador(datosDonador, direccionId);

      setMensaje({ texto: 'Registro completado con éxito!', tipo: 'success' });
      
      // en 2 segundos despues del regoistro te lleva a la pagina principal siempre que el registrp fuera exitoso
      setTimeout(() => {
        navigate(`/${nombreRol.toLowerCase()}/inicio`);
      }, 2000);

    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      setMensaje({ 
        texto: `Error: ${error.response?.data?.detail || error.message}`,
        tipo: 'error' 
      });
    } finally {
      setRegistroEnProgreso(false);
    }
  };

  const confirmarRegistro = () => {
    setMostrarConfirmacion(true);
  };

  const cancelarRegistro = () => {
    setMostrarConfirmacion(false);
  };
//para el resumen de los datos ingresados 
  const renderResumenCompleto = () => {
    return (
      <div className="space-y-6">
        {mensaje.texto && (
          <div className={`p-4 rounded ${
            mensaje.tipo === 'error' ? 'bg-red-100 text-red-800' : 
            mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {mensaje.texto}
          </div>
        )}
        
        <div className="p-4 border rounded bg-gray-50 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos Personales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Nombre:</p>
              <p>{datosDonador.nombre || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Apellido Paterno:</p>
              <p>{datosDonador.apellidoP || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Apellido Materno:</p>
              <p>{datosDonador.apellidoM || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Edad:</p>
              <p>{datosDonador.edad || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Tipo de Sangre:</p>
              <p>{datosDonador.tipoSangre || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Peso:</p>
              <p>{datosDonador.peso || "No ingresado"} kg</p>
            </div>
            <div>
              <p className="font-medium">Teléfono 1:</p>
              <p>{datosDonador.telefonoUno || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Teléfono 2:</p>
              <p>{datosDonador.telefonoDos || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Primera Donación:</p>
              <p>{datosDonador.primeraDonacion || "No ingresado"}</p>
            </div>
            <div>
              <p className="font-medium">Última Donación:</p>
              <p>{datosDonador.ultimaDonacion || "No ingresado"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded bg-gray-50 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos de Ubicación</h3>
          {datosDireccion ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Municipio:</p>
                <p>{datosDireccion.municipio || "No ingresado"}</p>
              </div>
              <div>
                <p className="font-medium">Colonia:</p>
                <p>{datosDireccion.colonia || "No ingresado"}</p>
              </div>
              <div>
                <p className="font-medium">Calle:</p>
                <p>{datosDireccion.calle || "No ingresado"}</p>
              </div>
              <div>
                <p className="font-medium">Número Exterior:</p>
                <p>{datosDireccion.numeroExterior || "No ingresado"}</p>
              </div>
              {datosDireccion.numeroInterior && (
                <div>
                  <p className="font-medium">Número Interior:</p>
                  <p>{datosDireccion.numeroInterior}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="font-medium">Ubicación:</p>
                <p>
                  {datosDireccion.latitud && datosDireccion.longitud
                    ? `Lat: ${datosDireccion.latitud.toFixed(4)}, Lng: ${datosDireccion.longitud.toFixed(4)}`
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (direccionRef.current) {
        const nuevosDatos = direccionRef.current.getFormData();
        setDatosDireccion(nuevosDatos);
        setDireccionValida(direccionRef.current.isValid());
        setDireccionState({
          municipioDetectadoPorGPS: nuevosDatos.municipioDetectadoPorGPS,
          municipioTocado: nuevosDatos.municipioTocado,
          municipioValido: nuevosDatos.municipioValido,
          esMunicipioManual: nuevosDatos.esMunicipioManual,
          colonia: nuevosDatos.colonia,
          calle: nuevosDatos.calle,
          numeroExterior: nuevosDatos.numeroExterior,
          numeroInterior: nuevosDatos.numeroInterior,
          nombreMunicipio: nuevosDatos.municipio,
          latitud: nuevosDatos.latitud,
          longitud: nuevosDatos.longitud,
          estado: nuevosDatos.estado,
          errores: nuevosDatos.errores,
          sugerencias: nuevosDatos.sugerencias
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
//verificar que usuario esta logeado
  useEffect(() => {
    const fetchUsuarioAutenticado = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rol = res.data.rol?.toLowerCase();
        const usuario = res.data.nombre_usuario;
        const idUsuarios = res.data.id;

        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setIdUsuario(idUsuarios);
          setEsValido(true);
        } else {
          setEsValido(false);
        }
      } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
        setEsValido(false);
      }
    };

    fetchUsuarioAutenticado();
  }, [token, nombreRol]);

  const siguientePaso = () => {
    if (paso === 1 && !formularioValido) return;
    if (paso === 2 && !direccionValida) return;
    setPaso(paso + 1);
  };

  const regresarPaso = () => {
    if (paso > 1) setPaso(paso - 1);
  };
//si no es valido el registro te regresqa al inicio de sesion
  if (esValido === false) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700">Banco de Sangre</h1>
            <p className="text-[16px] text-gray-600 font-bold">Ángeles</p>
          </div>
        </div>
      </div>
   

      {/* modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0  bg-opacity-150 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Registro</h3>
            <p className="mb-6">¿Estás seguro de que deseas completar el registro con los datos proporcionados?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarRegistro}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegistroCompleto}
                className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-green-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center my-4">
        <div className="text-xl font-semibold mb-4 text-center">
          Completar registro
        </div>

        <div className="flex mb-6 space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            1
          </div>
          <div className="flex items-center">
            <div className={`h-1 w-8 ${paso >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            2
          </div>
          <div className="flex items-center">
            <div className={`h-1 w-8 ${paso >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            3
          </div>
        </div>

        <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg overflow-auto">
          <div className="h-120">
            {paso === 1 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
                <RegistroDonador
                  datosDonador={datosDonador}
                  setDatosDonador={setDatosDonador}
                  setFormularioValido={setFormularioValido}
                />
              </div>
            )}

            {paso === 2 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Datos de Ubicación</h2>
                <RegistroDireccion 
                  ref={direccionRef}
                  hideSubmitButton={true}
                  {...direccionState}
                />
              </div>
            )}

            {paso === 3 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Resumen de Registro</h2>
                {renderResumenCompleto()}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            {paso > 1 && (
              <button
                onClick={regresarPaso}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Regresar
              </button>
            )}
            
            {paso < 3 ? (
              <button
                onClick={siguientePaso}
                disabled={paso === 1 ? !formularioValido : !direccionValida}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  (paso === 1 ? !formularioValido : !direccionValida) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={confirmarRegistro}
                disabled={!formularioValido || !direccionValida || registroEnProgreso}
                className={`px-4 py-2 bg-teal-800 text-white rounded hover:bg-green-600 ${
                  !formularioValido || !direccionValida || registroEnProgreso ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {registroEnProgreso ? 'Procesando...' : 'Confirmar Registro'}
              </button>
            )}
          </div>
          
        </div>
        
      </div>
      <Footer/>
    </div>
  );
};

export default CompletarRegistro; 
