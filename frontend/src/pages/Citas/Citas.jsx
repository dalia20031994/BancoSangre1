// Citas.jsx
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerCitas, crearCita } from '../../api/citas.api';
import { getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api'; // Importa la función que definiste

const Citas = () => {
  const { token } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const [donador, setDonador] = useState(null);
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Obtener usuario autenticado
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        if (!token) return;
        const usuarioData = await getAuthenticatedUser(token);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setMensaje('Error al obtener usuario autenticado.');
      }
    };
    obtenerUsuario();
  }, [token]);

  // Obtener donador según usuario
  useEffect(() => {
    if (!usuario) return;

    const obtenerDonador = async () => {
      try {
        // Usa la función fetchDonadorByUserId para obtener donador
        const donadorData = await fetchDonadorByUserId(usuario.id, token);
        setDonador(donadorData);
      } catch (error) {
        console.error('Error al obtener el donador:', error);
        setMensaje('Error al obtener datos del donador.');
      }
    };

    obtenerDonador();
  }, [usuario, token]);

  // Cargar citas del donador
  useEffect(() => {
    if (!donador) return;

    const cargarCitas = async () => {
      try {
        const todas = await obtenerCitas(token);
        const citasFiltradas = todas.filter((c) => c.donador === donador.id);
        setCitas(citasFiltradas);
      } catch (error) {
        console.error('Error al cargar las citas:', error);
        setMensaje('Error al cargar las citas.');
      }
    };

    cargarCitas();
  }, [donador, token]);

  const handleAgendarClick = (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      setMensaje('Por favor selecciona fecha y hora válidas.');
      return;
    }
    if (!donador) {
      setMensaje('No se encontró información del donador.');
      return;
    }
    setMensaje('');
    setModalVisible(true);
  };

  const confirmarCita = async () => {
    try {
      if (!usuario?.rol) {
        setMensaje('Error: rol del usuario no definido.');
        setModalVisible(false);
        return;
      }

      const nuevaCita = {
        estado: 'pendiente',
        fecha,
        hora,
        donador: donador.id,
      };

      const citaGuardada = await crearCita(nuevaCita, token);
      setCitas((prev) => [...prev, citaGuardada]);
      setFecha('');
      setHora('');
      setModalVisible(false);

      navigate(`/${usuario.rol}/Cita-Programada`, {
        state: { cita: citaGuardada, donador },
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);
      if (error.response?.data?.message) {
        setMensaje('Error: ' + error.response.data.message);
      } else if (error.response?.data) {
        setMensaje('Error: ' + JSON.stringify(error.response.data));
      } else {
        setMensaje('Error al agendar la cita. Intenta nuevamente.');
      }
      setModalVisible(false);
    }
  };

  const cancelarCita = () => {
    setModalVisible(false);
    setMensaje('');
  };

  if (!donador) return <div className="text-center mt-10 text-gray-500">Cargando datos...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg relative">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b border-gray-200 pb-3">🩸 Citas del Donador</h2>

      {mensaje && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-md shadow-sm">
          <p>{mensaje}</p>
        </div>
      )}

      {citas.length === 0 ? (
        <p className="text-center text-gray-600 mb-6">Aún no tienes citas registradas.</p>
      ) : (
        <div className="overflow-x-auto mb-8">
        </div>
      )}

      <form className="bg-slate-50 p-6 rounded-md border border-slate-200 shadow-sm space-y-5" onSubmit={handleAgendarClick}>
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
        >
          ✅ Agendar Cita
        </button>
      </form>

      {modalVisible && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 text-center">
              <h3 className="text-xl font-semibold text-red-700">Confirmar Cita</h3>
              <p>¿Deseas confirmar la cita para el {fecha} a las {hora}?</p>
              <div className="mt-6 flex justify-center gap-4">
                <button onClick={confirmarCita} className="bg-green-600 text-white px-5 py-2 rounded-md">
                  Confirmar
                </button>
                <button onClick={cancelarCita} className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Citas;
