import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const HistorialCitas = () => {
  const { token } = useContext(AuthContext);
  const [donador, setDonador] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('No autorizado');
      setLoading(false);
      return;
    }

    const cargarHistorial = async () => {
      try {
        // 1. Obtener usuario autenticado
        const usuarioRes = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const idUsuario = usuarioRes.data.id;

        // 2. Obtener donador asociado
        const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${idUsuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonador(donadorRes.data);

        // 3. Obtener todas las citas del donador
        const citasRes = await axios.get(`http://127.0.0.1:8000/api/cita/donador/${donadorRes.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCitas(citasRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar historial de citas.');
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [token]);

  if (loading) return <div className="text-center mt-10">Cargando historial de citas...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  if (!donador) return <div className="text-center mt-10 text-red-500 font-semibold">No se encontró el donador.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Historial de Citas de {donador.nombre}</h1>

      {citas.length === 0 ? (
        <p className="text-center text-gray-600">No tienes citas registradas.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(cita => (
              <tr key={cita.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{cita.fecha}</td>
                <td className="border border-gray-300 px-4 py-2">{cita.hora}</td>
                <td className={`border border-gray-300 px-4 py-2 font-semibold ${
                  cita.estado === 'cancelada' ? 'text-red-600' : 'text-green-700'
                }`}>
                  {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialCitas;
