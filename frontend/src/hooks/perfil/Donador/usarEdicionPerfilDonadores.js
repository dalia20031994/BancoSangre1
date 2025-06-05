import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../auth/AuthContext';
import {
  fetchDonadorById,
  fetchUserById,
} from '../../../api/donador.api';

import {
  fetchDireccionById,
  fetchColoniaById,
  fetchCoordenadaById
} from '../../../api/direccion.api';
const usarEdicionPerfilDonadores = (setMensaje) => {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); 
  const [esValidoRol, setEsValidoRol] = useState(null);
  const [idDonador, setIdDonador] = useState(null);
  const [idDireccion, setIdDireccion] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre_usuario: '',
    correo: '',
    sexo: '',
    password: '',
    password_confirmation: ''
  });
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
  const [datosDireccionOriginales, setDatosDireccionOriginales] = useState(null);
  const [direccionState, setDireccionState] = useState({
    municipioDetectadoPorGPS: false,
    municipioTocado: false,
    municipioValido: true,
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
  const cargarDatosIniciales = useCallback(async () => {
    try {
      // Obtener datos del donador específico
      const donador = await fetchDonadorById(id, token);
      setIdDonador(donador.id);
      setIdUsuario(donador.usuario);

      // Obtener datos del usuario asociado
      const usuario = await fetchUserById(donador.usuario, token);
      setDatosUsuario({
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        sexo: usuario.sexo,
        password: '',
        password_confirmation: ''
      });

      // Formatear fechas
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

      // Obtener datos de dirección si existe
      if (donador.direccion) {
        setIdDireccion(donador.direccion);
        const direccion = await fetchDireccionById(donador.direccion, token);
        const colonia = await fetchColoniaById(direccion.colonia, token);
        
        const municipioRes = await fetch(`http://127.0.0.1:8000/api/municipio/${colonia.municipio}/`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json());

        let latitud = null;
        let longitud = null;
        if (direccion.coordenadas) {
          const coordenadas = await fetchCoordenadaById(direccion.coordenadas, token);
          latitud = coordenadas.latitud;
          longitud = coordenadas.longitud;
        }

        const datosOriginales = {
          municipio: municipioRes.nombre,
          colonia: colonia.nombre,
          calle: direccion.calle,
          numeroExterior: direccion.numExterior,
          numeroInterior: direccion.numInterior || "",
          latitud: latitud,
          longitud: longitud,
          estado: "Oaxaca"
        };

        setDatosDireccionOriginales(datosOriginales);
        setDireccionState(prev => ({
          ...prev,
          colonia: colonia.nombre,
          calle: direccion.calle,
          numeroExterior: direccion.numExterior,
          numeroInterior: direccion.numInterior || "",
          nombreMunicipio: municipioRes.nombre,
          latitud: latitud,
          longitud: longitud,
          municipioValido: true,
          municipioTocado: true,
          esMunicipioManual: true,
          errores: {}
        }));
      }
      setEsValidoRol(true); 
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setEsValidoRol(false);
      setMensaje({ texto: `Error al cargar datos: ${error.message}`, tipo: 'error' });
    }
  }, [token, id, setMensaje]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  return {
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
  };
};
export default usarEdicionPerfilDonadores;