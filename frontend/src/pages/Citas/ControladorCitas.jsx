// para que se muestre el componente segun si ya pasaron los meses necesarios 
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import moment from 'moment';
import { getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api';
import { fetchCitasPorDonador } from '../../api/citas.api';
import Citas from './Citas';
import CitaInadecuada from './ObtenerCitas';
import MiCitaActiva from './CitaProgramada';

const CitasInteligente = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componenteACargar, setComponenteACargar] = useState(null);
  useEffect(() => {
    const decidirVistaCitas = async () => {
      if (!token) {
        setError('No autorizado');
        setLoading(false);
        return;
      }
      try {
        // 1. Obtener usuario autenticado
        const usuario = await getAuthenticatedUser(token);
        if (usuario.rol.toLowerCase() !== 'donador') {
          setError('Acceso denegado: Esta sección es solo para donadores.');
          setLoading(false);
          return;
        }
        // 2. Obtener donador
        const donador = await fetchDonadorByUserId(usuario.id, token);
        // 3. Evaluar período de espera por última donación
        if (donador.ultimaDonacion) {
          const ultima = moment(donador.ultimaDonacion);
          const meses = usuario.sexo === 'F' ? 3 : 2;
          const fechaDisponible = ultima.clone().add(meses, 'months');
          const hoy = moment();

          if (hoy.isBefore(fechaDisponible, 'day')) {
            setComponenteACargar(<CitaInadecuada />);
            setLoading(false);
            return;
          }
        }
        // 4. Verificar si ya hay una cita pendiente
        const citas = await fetchCitasPorDonador(donador.id, token);
        const tieneCitaPendiente = citas.some(c => c.estado === 'pendiente');
        if (tieneCitaPendiente) {
          setComponenteACargar(<MiCitaActiva />);
        } else {
          setComponenteACargar(<Citas />);
        }
      } catch (err) {
        console.error('Error al decidir la vista de citas:', err);
        setError('Error al cargar la información de citas. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    decidirVistaCitas();
  }, [token]);
  if (loading) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Cargando información de citas...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 text-xl font-semibold">
        {error}
      </div>
    );
  }
  return <div>{componenteACargar}</div>;
};
export default CitasInteligente;
