// CitasInteligente.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import moment from 'moment';


// Importa los componentes que vas a renderizar condicionalmente
import Citas from './Citas';
import CitaInadecuada from './CitaProgramada copy';
import MiCitaActiva from './CitaProgramada';

const CitasInteligente = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componenteACargar, setComponenteACargar] = useState(null); // Estado para decidir qué componente renderizar

  useEffect(() => {
    const decidirVistaCitas = async () => {
      if (!token) {
        setError('No autorizado');
        setLoading(false);
        return;
      }

      try {
        // 1. Obtener datos del usuario autenticado (incluyendo rol y sexo)
        const usuarioRes = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuarioData = usuarioRes.data;

        // Verificar si es donador (esta página es específicamente para donadores)
        if (usuarioData.rol.toLowerCase() !== 'donador') {
          setError('Acceso denegado: Esta sección es solo para donadores.');
          setLoading(false);
          return;
        }

        // 2. Obtener datos del donador (incluyendo ultimaDonacion)
        const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${usuarioData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const donadorData = donadorRes.data;

        // --- Lógica de Decisión ---

        // A. Verificar período de espera por última donación
        if (donadorData.ultimaDonacion) {
          const ultimaDonacionMoment = moment(donadorData.ultimaDonacion);
          let mesesEspera;
          if (usuarioData.sexo === 'M') {
            mesesEspera = 2;
          } else if (usuarioData.sexo === 'F') {
            mesesEspera = 3;
          } else {
            mesesEspera = 2; // Default
          }

          const fechaProximaDonacion = ultimaDonacionMoment.add(mesesEspera, 'months');
          const hoy = moment();

          if (hoy.isBefore(fechaProximaDonacion, 'day')) {
            // Todavía está en período de espera
            setComponenteACargar(<CitaInadecuada />);
            setLoading(false);
            return; // Detener la ejecución
          }
        }

        // B. Si no está en período de espera, verificar citas pendientes
        const citasRes = await axios.get(`http://127.0.0.1:8000/api/cita/donador/${donadorData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const citasPendientes = citasRes.data.filter(cita => cita.estado === 'pendiente');

        if (citasPendientes.length > 0) {
          // Tiene una cita pendiente
          setComponenteACargar(<MiCitaActiva />);
          setLoading(false);
          return; // Detener la ejecución
        }

        // C. Si no hay período de espera y no hay citas pendientes, permitir agendar
        setComponenteACargar(<Citas />); // Tu componente para agendar una nueva cita
        setLoading(false);

      } catch (err) {
        console.error('Error al decidir la vista de citas:', err);
        setError('Error al cargar la información de citas. Intenta de nuevo.');
        setLoading(false);
      }
    };

    decidirVistaCitas();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Cargando información de citas...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600 text-xl font-semibold">{error}</div>;
  }

  // Renderiza el componente decidido
  return (
    <div>
      {componenteACargar}
    </div>
  );
};

export default CitasInteligente;