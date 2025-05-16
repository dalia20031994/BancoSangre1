/* logica del dormulario de direccion*/
import { useState, useContext, useRef, useEffect, useImperativeHandle, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthContext";
import municipiosD from "../../../data/municipiosD.json";
import { validarNumero, validarMunicipio } from "../Auxiliares/validation";
import { estaDentroDeOaxaca } from "../Auxiliares/geoUtils";

export default function usarRegistroDireccion(props, ref) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formState, setFormState] = useState({
    municipioDetectadoPorGPS: props.municipioDetectadoPorGPS || false,
    municipioTocado: props.municipioTocado || false,
    esMunicipioManual: props.esMunicipioManual || false,
    colonia: props.colonia || "",
    calle: props.calle || "",
    numeroExterior: props.numeroExterior || "",
    numeroInterior: props.numeroInterior || "",
    nombreMunicipio: props.nombreMunicipio || "",
    latitud: props.latitud || null,
    longitud: props.longitud || null,
    estado: props.estado || "Oaxaca",
    sugerencias: props.sugerencias || [],
    evitarActualizacionManual: false,
    cargando: false,
    esperando: false
  });

  // los errores de validación
  const [errores, setErrores] = useState(props.errores || {});

  // Referencias
  const inputRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Efectos
  useEffect(() => {
    setFormState(prev => ({ ...prev, cargando: true }));
    setTimeout(() => {
      setFormState(prev => ({ ...prev, cargando: false }));
    }, 800);
  }, []);

  useEffect(() => {
  if (!formState.municipioTocado) return;

  if (formState.municipioDetectadoPorGPS) {
    setErrores({});
    setFormState(prev => ({ ...prev, sugerencias: [] }));
    return;
  }

  // Realiza la validación cuando el municipio cambia
  const resultado = validarMunicipio(formState.nombreMunicipio, municipiosD);

  if (resultado.valido && resultado.municipio) {
    if (!formState.evitarActualizacionManual) {
      setFormState(prev => ({
        ...prev,
        latitud: resultado.municipio.lat,
        longitud: resultado.municipio.lng,
        estado: "Oaxaca"
      }));
    }
    setErrores({});
    setFormState(prev => ({ ...prev, sugerencias: [] }));
  } else {
    setErrores(resultado.error ? { municipio: resultado.error } : {});
    setFormState(prev => ({ 
      ...prev, 
      sugerencias: resultado.sugerencias || [],
      municipioValido: false
    }));
  }
}, [formState.nombreMunicipio, formState.municipioTocado, formState.municipioDetectadoPorGPS, formState.evitarActualizacionManual]);

  // Validaciones
  const municipioValido = Boolean(
    formState.municipioValido || 
    (formState.municipioDetectadoPorGPS && formState.nombreMunicipio)
  );

  const formularioValido = Boolean(
    municipioValido &&
    formState.colonia.trim() !== "" &&
    formState.calle.trim() !== "" &&
    validarNumero(formState.numeroExterior) &&
    (formState.numeroInterior.trim() === "" || validarNumero(formState.numeroInterior)) &&
    formState.latitud != null && 
    formState.longitud != null
  );

  // Acciones del formulario
  const setField = (field) => (value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  const setNombreMunicipio = (value) => {
  setFormState(prev => ({ 
    ...prev, 
    nombreMunicipio: value,
    municipioDetectadoPorGPS: false
  }));
  if (!formState.municipioTocado) {
    setFormState(prev => ({ ...prev, municipioTocado: true }));
  }
};

  const handleSuggestionClick = async (municipio) => {
    setFormState(prev => ({ ...prev, esperando: true }));
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${municipio.lat}&lon=${municipio.lng}&format=json&addressdetails=1`, {
        headers: { "User-Agent": "ReactApp" }
      });
      const data = await response.json();
      const address = data.address;

      const autoColonia = address.neighbourhood || address.suburb || address.hamlet || address.quarter || 
                         address.residential || address.city_district || address.locality || "Colonia sin nombre";
      const autoCalle = address.road || address.pedestrian || address.footway || "Calle sin nombre";

      setFormState(prev => ({
        ...prev,
        nombreMunicipio: municipio.label,
        latitud: municipio.lat,
        longitud: municipio.lng,
        colonia: autoColonia,
        calle: autoCalle,
        municipioDetectadoPorGPS: true,
        municipioValido: true,
        evitarActualizacionManual: false,
        esperando: false
      }));

      setErrores({});
      if (inputRef.current) inputRef.current.focus();
    } catch (error) {
      console.error("Error al obtener dirección desde sugerencia:", error);
      setFormState(prev => ({ ...prev, esperando: false }));
    }
  };

  const detectarUbicacion = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (!estaDentroDeOaxaca(latitude, longitude)) {
            setErrores({ ubicacion: "La ubicación detectada está fuera de Oaxaca." });
            return;
          }

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, {
              headers: { "User-Agent": "ReactApp" }
            });
            const data = await response.json();
            const address = data.address;

            const nombreMunicipio = address.city || address.town || address.village || address.county || "Municipio desconocido";
            const colonia = address.neighbourhood || address.suburb || address.hamlet || address.quarter || 
                            address.residential || address.city_district || "Colonia sin nombre";
            const calle = address.road || address.pedestrian || address.footway || "Calle sin nombre";

            setFormState(prev => ({
              ...prev,
              latitud: latitude,
              longitud: longitude,
              nombreMunicipio,
              colonia,
              calle,
              estado: "Oaxaca",
              municipioDetectadoPorGPS: true,
              municipioValido: true,
              evitarActualizacionManual: true
            }));
            setErrores({});
          } catch (error) {
            console.error("Error al obtener nombre del municipio:", error);
            setErrores({ ubicacion: "No se pudo obtener el nombre del municipio" });
          }
        },
        () => setErrores({ ubicacion: "No se pudo detectar la ubicación" })
      );
    } else {
      setErrores({ ubicacion: "Geolocalización no soportada" });
    }
  }, []);

  const handleMarkerDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();

    if (!estaDentroDeOaxaca(lat, lng)) {
      setErrores({ ubicacion: "No puedes mover el marcador fuera de Oaxaca." });
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`, {
        headers: { "User-Agent": "ReactApp" }
      });
      const data = await response.json();
      const address = data.address;

      setFormState(prev => ({
        ...prev,
        latitud: lat,
        longitud: lng,
        nombreMunicipio: address.city || address.town || address.village || address.county || "Municipio desconocido",
        colonia: address.neighbourhood || address.suburb || address.hamlet || address.quarter || address.residential || address.city_district || "Colonia sin nombre",
        calle: address.road || address.pedestrian || address.footway || "Calle sin nombre",
        municipioDetectadoPorGPS: true
      }));
      setErrores({});
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
      setErrores({ ubicacion: "No se pudo obtener la dirección de la nueva ubicación" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.onSubmit) {
      props.onSubmit({
        municipio: formState.nombreMunicipio,
        colonia: formState.colonia,
        calle: formState.calle,
        numeroExterior: formState.numeroExterior,
        numeroInterior: formState.numeroInterior,
        latitud: formState.latitud,
        longitud: formState.longitud,
        estado: formState.estado
      });
    } else {
      setFormState(prev => ({ ...prev, cargando: true }));
      
      try {
        // Lógica de envío al backend...
        // Similar a la original pero usando formState
        navigate("/dashboard", { state: { registroCompleto: true } });
      } catch (err) {
        console.error(err);
        setErrores({ general: err.message || "Error al guardar los datos" });
      } finally {
        setFormState(prev => ({ ...prev, cargando: false }));
      }
    }
  };

  // Exponer métodos al padre mediante ref
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      municipio: formState.nombreMunicipio,
      colonia: formState.colonia,
      calle: formState.calle,
      numeroExterior: formState.numeroExterior,
      numeroInterior: formState.numeroInterior,
      latitud: formState.latitud,
      longitud: formState.longitud,
      estado: formState.estado,
      municipioDetectadoPorGPS: formState.municipioDetectadoPorGPS,
      municipioTocado: formState.municipioTocado,
      municipioValido,
      esMunicipioManual: formState.esMunicipioManual,
      errores,
      sugerencias: formState.sugerencias
    }),
    isValid: () => formularioValido,
    resetForm: () => {
      setFormState({
        municipioDetectadoPorGPS: false,
        municipioTocado: false,
        municipioValido: false,
        colonia: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        nombreMunicipio: "",
        latitud: null,
        longitud: null,
        estado: "Oaxaca",
        sugerencias: [],
        cargando: false,
        esperando: false,
        evitarActualizacionManual: false
      });
      setErrores({});
    }
  }));

  return {
    token,
    formState,
    formActions: {
      setNombreMunicipio,
      setColonia: setField('colonia'),
      setCalle: setField('calle'),
      setNumeroExterior: setField('numeroExterior'),
      setNumeroInterior: setField('numeroInterior'),
      handleSuggestionClick,
      detectarUbicacion,
      handleMarkerDragEnd,
      inputRef
    },
    formValidation: {
      municipioValido,
      formularioValido,
      validarNumero,
      errores
    },
    handleSubmit,
    cargando: formState.cargando
  };
}