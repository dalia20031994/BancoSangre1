import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';

const ProtectedCitas = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [hasPendingCita, setHasPendingCita] = useState(false);
  const [donadorId, setDonadorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonadorAndCitas = async () => {
      try {
        // Obtener info usuario autenticado para sacar id donador
        const userRes = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Obtener id donador según el usuario
        const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${userRes.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonadorId(donadorRes.data.id);

        // Consultar citas del donador
        const citasRes = await axios.get(`http://127.0.0.1:8000/api/citas/donador/${donadorRes.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verificar si hay citas pendientes
        const pendientes = citasRes.data.filter(cita => cita.estado === 'pendiente');
        if (pendientes.length > 0) {
          setHasPendingCita(true);
          // Redirigir a cita programada
          navigate('/donador/Cita-Programada', { replace: true, state: { cita: pendientes[0] } });
        }
      } catch (error) {
        console.error('Error al validar citas:', error);
        // Si hay error, dejamos cargar la página normal para no bloquear
      } finally {
        setLoading(false);
      }
    };

    fetchDonadorAndCitas();
  }, [token, navigate]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si hay cita pendiente, ya redirigió y no mostrará nada aquí
  // Si no hay, mostramos el contenido normal (children)
  if (!hasPendingCita) {
    return <>{children}</>;
  }

  return null; // Esto no debería alcanzarse porque redirigió arriba
};

export default ProtectedCitas;
