import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import RegistroDonador from "../components/Donador/RegistroDonador";
import ModificarDireccion from "../components/Direccion/ModificarDireccion/ModificarDireccion";
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import RegistroUsuario from "../components/Usuarios/RegistroUsuario";

const EditarPerfilDonador = () => {
  const { token } = useContext(AuthContext);
  const [paso, setPaso] = useState(1);
  const [formularioValido, setFormularioValido] = useState(false);
  const direccionRef = useRef();
  const [datosDireccion, setDatosDireccion] = useState(null);
  const [datosDireccionOriginales, setDatosDireccionOriginales] = useState(null);
  const [direccionValida, setDireccionValida] = useState(true); // Inicialmente true
  const [direccionModificada, setDireccionModificada] = useState(false);
  const [esValido, setEsValido] = useState(null);
  const { nombreRol } = useParams();
  const [idDonador, setIdDonador] = useState(null);
  const [idDireccion, setIdDireccion] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [actualizacionEnProgreso, setActualizacionEnProgreso] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();
const [datosUsuario, setDatosUsuario] = useState({
  nombre_usuario: '',
  correo: '',
  sexo: '',
  password: '',
  password_confirmation: ''
});
const [usuarioValido, setUsuarioValido] = useState(false);
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

  const [direccionState, setDireccionState] = useState({
    municipioDetectadoPorGPS: false,
    municipioTocado: false,
    municipioValido: true, // Inicialmente true
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

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resUsuario = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rol = resUsuario.data.rol?.toLowerCase();
        const usuarioId = resUsuario.data.id;

        if (rol !== nombreRol.toLowerCase()) {
          setEsValido(false);
          return;
        }

        setIdUsuario(usuarioId);
        
        const us = await axios.get(`http://127.0.0.1:8000/api/usuarios/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDatosUsuario({
        nombre_usuario: us.data.nombre_usuario,
        correo: us.data.correo,
        sexo: us.data.sexo,
        password: '',
        password_confirmation: ''
      });
        const resDonador = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resDonador.data.length === 0) {
          setEsValido(false);
          return;
        }

        const donador = resDonador.data;
        const donadorId = resDonador.data.id;
        setIdDonador(donadorId);

        const formatDate = (dateString) => {
          if (!dateString || dateString === "1900-01-01") return "";
          return dateString.split('T')[0];
        };

        setDatosDonador({
          nombre: donador.nombre,
          apellidoP: donador.apellidoP,
          apellidoM: donador.apellidoM,
          edad: donador.edad,
          primeraDonacion: formatDate(donador.primeraDonacion),
          ultimaDonacion: formatDate(donador.ultimaDonacion),
          tipoSangre: donador.tipoSangre,
          peso: donador.peso,
          telefonoUno: donador.telefonoUno,
          telefonoDos: donador.telefonoDos || "",
          estado: donador.estado,
        });

        setFormularioValido(true);

        if (donador.direccion) {
          setIdDireccion(donador.direccion);

          const resDireccion = await axios.get(`http://127.0.0.1:8000/api/direccion/${donador.direccion}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const direccion = resDireccion.data;

          const resColonia = await axios.get(`http://127.0.0.1:8000/api/colonia/${direccion.colonia}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const resMunicipio = await axios.get(`http://127.0.0.1:8000/api/municipio/${resColonia.data.municipio}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          let latitud = null;
          let longitud = null;
          if (direccion.coordenadas) {
            const resCoordenadas = await axios.get(`http://127.0.0.1:8000/api/coordenada/${direccion.coordenadas}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            latitud = resCoordenadas.data.latitud;
            longitud = resCoordenadas.data.longitud;
          }

          const datosOriginales = {
            municipio: resMunicipio.data.nombre,
            colonia: resColonia.data.nombre,
            calle: direccion.calle,
            numeroExterior: direccion.numExterior,
            numeroInterior: direccion.numInterior || "",
            latitud: latitud,
            longitud: longitud,
            estado: "Oaxaca"
          };

          setDatosDireccionOriginales(datosOriginales);
          setDatosDireccion(datosOriginales);

          setDireccionState(prev => ({
            ...prev,
            colonia: resColonia.data.nombre,
            calle: direccion.calle,
            numeroExterior: direccion.numExterior,
            numeroInterior: direccion.numInterior || "",
            nombreMunicipio: resMunicipio.data.nombre,
            latitud: latitud,
            longitud: longitud,
            municipioValido: true,
            municipioTocado: true,
            esMunicipioManual: true,
            errores: {}
          }));

          setDireccionValida(true);
        }

        setEsValido(true);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setEsValido(false);
      }
    };

    cargarDatos();
  }, [token, nombreRol]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (direccionRef.current) {
        const nuevosDatos = direccionRef.current.getFormData();

        const haCambiado = datosDireccionOriginales ?
          !isEqual(nuevosDatos, datosDireccionOriginales) :
          false;

        setDireccionModificada(haCambiado);
        setDatosDireccion(nuevosDatos);

        // Solo validar si hubo cambios
        setDireccionValida(!haCambiado || direccionRef.current.isValid());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [datosDireccionOriginales]);

  const verificarMunicipioExistente = async (nombreMunicipio) => {
    const response = await axios.get('http://127.0.0.1:8000/api/municipio/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.find(m => m.nombre.toLowerCase() === nombreMunicipio.toLowerCase())?.id || null;
  };

  const crearMunicipio = async (nombreMunicipio) => {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/municipio/',
      { nombre: nombreMunicipio },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.id;
  };

  const verificarColoniaExistente = async (nombreColonia, municipioId) => {
    const response = await axios.get('http://127.0.0.1:8000/api/colonia/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.find(c =>
      c.nombre.toLowerCase() === nombreColonia.toLowerCase() &&
      c.municipio === municipioId
    )?.id || null;
  };

  const crearColonia = async (nombreColonia, municipioId) => {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/colonia/',
      { nombre: nombreColonia, municipio: municipioId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.id;
  };

  const verificarCoordenadasExistentes = async (latitud, longitud) => {
    const response = await axios.get('http://127.0.0.1:8000/api/coordenada/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.find(coord =>
      Math.abs(coord.latitud - latitud) < 0.0001 &&
      Math.abs(coord.longitud - longitud) < 0.0001
    )?.id || null;
  };

  const crearCoordenadas = async (latitud, longitud) => {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/coordenada/',
      { latitud, longitud },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.id;
  };
  const actualizarUsuario = async (usuarioData) => {
  const dataToSend = {
    nombre_usuario: usuarioData.nombre_usuario,
    correo: usuarioData.correo,
    sexo: usuarioData.sexo,
    // Solo enviar password si se proporcionó
    ...(usuarioData.password && { password: usuarioData.password })
  };

  const response = await axios.patch(
    `http://127.0.0.1:8000/api/usuarios/${idUsuario}/`,
    dataToSend,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

  const actualizarDonador = async (donadorData) => {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/donador/${idDonador}/`,
      {
        nombre: donadorData.nombre,
        apellidoP: donadorData.apellidoP,
        apellidoM: donadorData.apellidoM,
        edad: donadorData.edad,
        primeraDonacion: donadorData.primeraDonacion || "1900-01-01",
        ultimaDonacion: donadorData.ultimaDonacion || "1900-01-01",
        tipoSangre: donadorData.tipoSangre,
        peso: donadorData.peso,
        telefonoUno: donadorData.telefonoUno,
        telefonoDos: donadorData.telefonoDos || null,
        estado: donadorData.estado,
        direccion: donadorData.direccion,
        usuario: idUsuario
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  const actualizarDireccion = async (direccionData) => {
    try {
      let municipioId = await verificarMunicipioExistente(direccionData.municipio);
      const municipioOriginal = direccionState.nombreMunicipio;

      if (municipioOriginal && municipioOriginal !== direccionData.municipio) {
        municipioId = await verificarMunicipioExistente(direccionData.municipio);

        if (!municipioId) {
          municipioId = await crearMunicipio(direccionData.municipio);
        }
      } else if (!municipioId) {
        municipioId = await crearMunicipio(direccionData.municipio);
      }

      let coloniaId = await verificarColoniaExistente(direccionData.colonia, municipioId);
      const coloniaOriginal = direccionState.colonia;

      if (coloniaOriginal !== direccionData.colonia || municipioOriginal !== direccionData.municipio) {
        coloniaId = await verificarColoniaExistente(direccionData.colonia, municipioId);

        if (!coloniaId) {
          coloniaId = await crearColonia(direccionData.colonia, municipioId);
        }
      } else if (!coloniaId) {
        coloniaId = await crearColonia(direccionData.colonia, municipioId);
      }

      let coordenadasId = null;
      const coordenadasOriginales = {
        latitud: direccionState.latitud,
        longitud: direccionState.longitud
      };
      const nuevasCoordenadas = {
        latitud: direccionData.latitud,
        longitud: direccionData.longitud
      };

      if (nuevasCoordenadas.latitud && nuevasCoordenadas.longitud) {
        if (!coordenadasOriginales.latitud ||
          !coordenadasOriginales.longitud ||
          Math.abs(coordenadasOriginales.latitud - nuevasCoordenadas.latitud) > 0.0001 ||
          Math.abs(coordenadasOriginales.longitud - nuevasCoordenadas.longitud) > 0.0001) {

          coordenadasId = await verificarCoordenadasExistentes(
            nuevasCoordenadas.latitud,
            nuevasCoordenadas.longitud
          );

          if (!coordenadasId) {
            coordenadasId = await crearCoordenadas(
              nuevasCoordenadas.latitud,
              nuevasCoordenadas.longitud
            );
          }
        } else {
          if (idDireccion) {
            const resDireccion = await axios.get(`http://127.0.0.1:8000/api/direccion/${idDireccion}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            coordenadasId = resDireccion.data.coordenadas;
          }
        }
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/direccion/${idDireccion}/`,
        {
          calle: direccionData.calle,
          numInterior: direccionData.numeroInterior || null,
          numExterior: direccionData.numeroExterior,
          colonia: coloniaId,
          coordenadas: coordenadasId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error('Error en actualizarDireccion:', error);
      throw error;
    }
  };

  const crearDireccion = async (direccionData) => {
    let municipioId = await verificarMunicipioExistente(direccionData.municipio);
    if (!municipioId) {
      municipioId = await crearMunicipio(direccionData.municipio);
    }

    let coloniaId = await verificarColoniaExistente(direccionData.colonia, municipioId);
    if (!coloniaId) {
      coloniaId = await crearColonia(direccionData.colonia, municipioId);
    }

    let coordenadasId = null;
    if (direccionData.latitud && direccionData.longitud) {
      coordenadasId = await verificarCoordenadasExistentes(direccionData.latitud, direccionData.longitud);
      if (!coordenadasId) {
        coordenadasId = await crearCoordenadas(direccionData.latitud, direccionData.longitud);
      }
    }

    const response = await axios.post(
      'http://127.0.0.1:8000/api/direccion/',
      {
        calle: direccionData.calle,
        numInterior: direccionData.numeroInterior || null,
        numExterior: direccionData.numeroExterior,
        colonia: coloniaId,
        coordenadas: coordenadasId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  };

  const handleActualizarPerfil = async () => {
    setMostrarConfirmacion(false);
    setActualizacionEnProgreso(true);
    setMensaje({ texto: 'Actualizando perfil...', tipo: 'info' });

    try {
       await actualizarUsuario(datosUsuario);
      let direccionId = idDireccion;

      if ((direccionModificada || !idDireccion) && direccionValida && datosDireccion) {
        if (idDireccion) {
          await actualizarDireccion(datosDireccion);
        } else {
          const nuevaDireccion = await crearDireccion(datosDireccion);
          direccionId = nuevaDireccion.id;
          setIdDireccion(direccionId);
        }
      }

      await actualizarDonador({
        ...datosDonador,
        direccion: direccionId
      });

      setMensaje({ texto: 'Perfil actualizado con éxito!', tipo: 'success' });
      setTimeout(() => navigate(`/${nombreRol.toLowerCase()}/inicio`), 1000);

    } catch (error) {
      console.error('Error al actualizar:', error);
      let errorMessage = 'Error al actualizar el perfil';

      if (error.response) {
        if (error.response.data) {
          errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
        } else {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        }
      }

      setMensaje({
        texto: errorMessage,
        tipo: 'error'
      });
    } finally {
      setActualizacionEnProgreso(false);
    }
  };

  const cancelarActualizacion = () => {
    setMostrarConfirmacion(false);
  };

  const confirmarActualizacion = () => {
    if (!formularioValido) {
      setMensaje({ texto: "Por favor completa correctamente los datos personales", tipo: "error" });
      return;
    }

    if (paso === 2 && direccionModificada && !direccionValida) {
      setMensaje({ texto: "Por favor completa correctamente los datos de dirección", tipo: "error" });
      return;
    }

    setMostrarConfirmacion(true);
  };

  const siguientePaso = () => {
  if (paso === 1 && !usuarioValido) {
    setMensaje({ texto: "Por favor completa correctamente los datos de usuario", tipo: "error" });
    return;
  }
  
  if (paso === 2 && !formularioValido) {
    setMensaje({ texto: "Por favor completa correctamente los datos personales", tipo: "error" });
    return;
  }

  if (paso === 3 && direccionModificada) {
    if (!direccionRef.current || !direccionRef.current.isValid()) {
      setMensaje({ texto: "Por favor completa correctamente los datos de dirección", tipo: "error" });
      return;
    }
  }

  setPaso(paso + 1);
};

  const regresarPaso = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  const renderResumenCompleto = () => {
    const formatCoord = (coord) => {
      if (coord === null || coord === undefined || isNaN(coord)) {
        return "N/D";
      }
      return typeof coord === 'number' ? coord.toFixed(6) : parseFloat(coord).toFixed(6);
    };
    return (
      
      <div className="space-y-6">
        {mensaje.texto && (
          <div className={`p-4 rounded ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-800' :
              mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
            }`}>
            {mensaje.texto}
          </div>
        )}
        <div className="p-4 border rounded bg-gray-50 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos de Usuario</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Nombre de usuario:</p>
            <p>{datosUsuario.nombre_usuario || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Correo electrónico:</p>
            <p>{datosUsuario.correo || "No ingresado"}</p>
          </div>
          <div>
            <p className="font-medium">Sexo:</p>
            <p>{datosUsuario.sexo || "No ingresado"}</p>
          </div>
        </div>
      </div>

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
                  {datosDireccion.latitud !== null && datosDireccion.longitud !== null
                    ? `Lat: ${formatCoord(datosDireccion.latitud)}, Lng: ${formatCoord(datosDireccion.longitud)}`
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

  if (esValido === false) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Actualización</h3>
            <p className="mb-6">¿Estás seguro de que deseas actualizar tu perfil con los datos proporcionados?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarActualizacion}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizarPerfil}
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
          Editar Perfil de Donador
        </div>

        <div className="flex mb-6 space-x-4">
  {/* Paso 1 - Usuario */}
  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
    1
  </div>
  <div className="flex items-center">
    <div className={`h-1 w-8 ${paso >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
  </div>
  
  {/* Paso 2 - Donador */}
  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
    2
  </div>
  <div className="flex items-center">
    <div className={`h-1 w-8 ${paso >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
  </div>
  
  {/* Paso 3 - Dirección */}
  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
    3
  </div>
  <div className="flex items-center">
    <div className={`h-1 w-8 ${paso >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
  </div>
  
  {/* Paso 4 - Resumen */}
  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paso === 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
    4
  </div>
</div>

        <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg overflow-auto">
          <div className="h-120">
            {paso === 1 && (
  <div className="h-full overflow-y-scroll space-y-4">
    <h2 className="text-lg font-semibold text-gray-700">Datos de Usuario</h2>
    <RegistroUsuario
      datosUsuario={datosUsuario}
      setDatosUsuario={setDatosUsuario}
      setFormularioValido={setUsuarioValido}
      modoEdicion={true}
    />
  </div>
)}
            {paso === 2 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
                <RegistroDonador
                  datosDonador={datosDonador}
                  setDatosDonador={setDatosDonador}
                  setFormularioValido={setFormularioValido}
                  modoEdicion={true}
                />
              </div>
            )}

            {paso === 3 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Datos de Ubicación</h2>
                <ModificarDireccion
                  ref={direccionRef}
                  hideSubmitButton={true}
                  modoEdicion={true}
                  // Pasar todos los valores individualmente en lugar de usar spread operator
                  nombreMunicipio={direccionState.nombreMunicipio}
                  colonia={direccionState.colonia}
                  calle={direccionState.calle}
                  numeroExterior={direccionState.numeroExterior}
                  numeroInterior={direccionState.numeroInterior}
                  latitud={direccionState.latitud}
                  longitud={direccionState.longitud}
                  municipioTocado={direccionState.municipioTocado}
                  municipioValido={direccionState.municipioValido}
                  municipioDetectadoPorGPS={direccionState.municipioDetectadoPorGPS}
                  esMunicipioManual={direccionState.esMunicipioManual}
                  estado={direccionState.estado}
                  errores={direccionState.errores}
                  sugerencias={direccionState.sugerencias}
                />
              </div>
            )}

            {paso === 4 && (
              <div className="h-full overflow-y-scroll space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Resumen de Cambios</h2>
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