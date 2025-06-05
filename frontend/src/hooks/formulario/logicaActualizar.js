// logicca general para actualizar
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import {
  updateUserData,
  updateDonadorData,
} from '../../api/donador.api';
import {
  updateDireccionData,
  createDireccionData,
  verifyMunicipioExists,
  createMunicipio,
  verifyColoniaExists,
  createColonia,
  verifyCoordenadasExists,
  createCoordenadas,
} from '../../api/direccion.api';
const logicaActualizar = (idUsuario, datosUsuario, idDonador, datosDonador, idDireccion, datosDireccion, direccionModificada, direccionValida, setMensaje, setIdDireccion) => {
  const { token } = useContext(AuthContext);
  const [actualizacionEnProgreso, setActualizacionEnProgreso] = useState(false);
  const handleActualizarPerfil = async (navigate, nombreRol) => {
    setActualizacionEnProgreso(true);
    setMensaje({ texto: 'Actualizando perfil...', tipo: 'info' });
    try {
      await updateUserData(idUsuario, datosUsuario, token);
      let currentDireccionId = idDireccion;

      if ((direccionModificada || !idDireccion) && direccionValida && datosDireccion) {
        let municipioId = await verifyMunicipioExists(datosDireccion.municipio, token);
        if (!municipioId) {
          municipioId = await createMunicipio(datosDireccion.municipio, token);
        }

        let coloniaId = await verifyColoniaExists(datosDireccion.colonia, municipioId, token);
        if (!coloniaId) {
          coloniaId = await createColonia(datosDireccion.colonia, municipioId, token);
        }

        let coordenadasId = null;
        if (datosDireccion.latitud && datosDireccion.longitud) {
          coordenadasId = await verifyCoordenadasExists(datosDireccion.latitud, datosDireccion.longitud, token);
          if (!coordenadasId) {
            coordenadasId = await createCoordenadas(datosDireccion.latitud, datosDireccion.longitud, token);
          }
        }

        if (idDireccion) {
          await updateDireccionData(idDireccion, datosDireccion, coloniaId, coordenadasId, token);
        } else {
          const nuevaDireccion = await createDireccionData(datosDireccion, coloniaId, coordenadasId, token);
          currentDireccionId = nuevaDireccion.id;
          setIdDireccion(currentDireccionId); // Actualiza el idDireccion en el estado global
        }
      }

      await updateDonadorData(idDonador, { ...datosDonador, direccion: currentDireccionId }, idUsuario, token);

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
      setMensaje({ texto: errorMessage, tipo: 'error' });
    } finally {
      setActualizacionEnProgreso(false);
    }
  };

  return { handleActualizarPerfil, actualizacionEnProgreso };
};
export default logicaActualizar;