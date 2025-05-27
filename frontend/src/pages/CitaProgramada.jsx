// MiCitaActiva.js (anteriormente CitaProgramada.js)
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const MiCitaActiva = () => { // Cambiado el nombre del componente
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { nombreRol } = useParams();

  const [donador, setDonador] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cita, setCita] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('No autorizado');
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        const usuarioRes = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuarioData = usuarioRes.data;
        setUsuario(usuarioData);

        const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${usuarioData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonador(donadorRes.data);

        // Buscar solo la cita pendiente más próxima
        const citasRes = await axios.get(`http://127.0.0.1:8000/api/cita/donador/${donadorRes.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const citasPendientes = citasRes.data.filter(c => c.estado === 'pendiente');
        if (citasPendientes.length === 0) {
          setCita(null);
        } else {
          citasPendientes.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
          setCita(citasPendientes[0]); // La cita pendiente más próxima
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token]);

  const confirmarCancelacion = async () => {
    if (!cita) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/cita/${cita.id}/`,
        { estado: 'cancelada' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMostrarModal(false);
      // Después de cancelar, redirigir a la página donde se puede agendar (tu componente Citas.js)
      navigate(`/${nombreRol}/citas`); // Redirige a la página para agendar
    } catch (err) {
      console.error('Error al cancelar cita:', err);
      alert('No se pudo cancelar la cita. Intenta nuevamente.');
    }
  };

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!donador) return <div className="text-center mt-10 text-red-500 font-semibold">❌ No se encontró el donador.</div>;
  if (!cita) return <div className="text-center mt-10 text-gray-700 font-semibold">No tienes citas programadas actualmente.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl text-center relative">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ¡Gracias por tu generosidad, {donador.nombre}!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Estás ayudando a salvar vidas con tu donación. 💖<br />
        Cada gota cuenta, y personas como tú hacen una gran diferencia.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm text-left">
        <h2 className="text-xl font-semibold text-green-800 mb-3">🗓️ Detalles de tu cita</h2>
        <p><strong>Fecha:</strong> {cita.fecha}</p>
        <p><strong>Hora:</strong> {cita.hora}</p>
        <p><strong>Estado:</strong> {cita.estado}</p>
      </div>

      <p className="mt-6 text-gray-600">
        Recuerda presentarte con anticipación y seguir las recomendaciones del personal médico. 🏥
      </p>

      <button
        onClick={() => setMostrarModal(true)}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition"
      >
        ❌ Cancelar Cita
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 z-50">
            <h2 className="text-xl font-bold mb-4">¿Confirmar cancelación?</h2>
            <p className="mb-4">¿Estás seguro de que deseas cancelar tu cita?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmarCancelacion}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sí, cancelar
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiCitaActiva; // Exporta con el nuevo nombre