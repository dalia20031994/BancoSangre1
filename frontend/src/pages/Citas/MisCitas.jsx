//para que el donador pueda ver el estado de sus sitas 
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api';
import { fetchCitasPorDonador } from '../../api/citas.api';
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
        //Obtener usuario autenticado
        const usuario = await getAuthenticatedUser(token);
        const idUsuario = usuario.id;
        //Obtener donador asociado
        const donadorData = await fetchDonadorByUserId(idUsuario, token);
        setDonador(donadorData);
        //Obtener citas del donador
        const citasData = await fetchCitasPorDonador(donadorData.id, token);
        setCitas(citasData);
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
