// la parte encargada de la modificacion de los datos de direccion
import React, { useRef, useEffect } from 'react';
import ModificarDireccion from '../Direccion/ModificarDireccion/ModificarDireccion'; 
import isEqual from 'lodash/isEqual'; 

const EdicionDireccion = ({
  direccionRef,
  direccionState,
  setDatosDireccion,
  setDireccionModificada,
  setDireccionValida,
  datosDireccionOriginales 
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (direccionRef.current) {
        const nuevosDatos = direccionRef.current.getFormData();
        const haCambiado = datosDireccionOriginales ?
          !isEqual(nuevosDatos, datosDireccionOriginales) :
          false;

        setDireccionModificada(haCambiado);
        setDatosDireccion(nuevosDatos);
        setDireccionValida(!haCambiado || direccionRef.current.isValid());
      }
    }, 1000); 
    return () => clearInterval(interval);
  }, [datosDireccionOriginales, direccionRef, setDatosDireccion, setDireccionModificada, setDireccionValida]);
  return (
    <div className="h-full overflow-y-scroll space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Datos de Ubicación</h2>
      <ModificarDireccion
        ref={direccionRef}
        hideSubmitButton={true}
        modoEdicion={true}
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
  );
};
export default EdicionDireccion;