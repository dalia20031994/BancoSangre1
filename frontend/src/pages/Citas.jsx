import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { obtenerCitas, crearCita } from '../api/citas..api';

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

  // Obtener usuario autenticado (con rol)
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuarioRes = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(usuarioRes.data);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    if (token) obtenerUsuario();
  }, [token]);

  // Obtener donador usando el id de usuario
  useEffect(() => {
    const obtenerDonador = async () => {
      try {
        if (!usuario) return;
        const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${usuario.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonador(donadorRes.data);
      } catch (error) {
        console.error('Error al obtener el donador:', error);
      }
    };

    obtenerDonador();
  }, [usuario, token]);

  // Cargar citas solo cuando hay donador
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        if (!donador) return;
        const todasCitas = await obtenerCitas(token);
        const citasDonador = todasCitas.filter(cita => cita.donador === donador.id);
        setCitas(citasDonador);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    };

    cargarCitas();
  }, [donador, token]);

  const handleAgendarClick = (e) => {
    e.preventDefault();
    if (!donador) return;
    setModalVisible(true);
  };

  const confirmarCita = async () => {
    try {
      if (!usuario) {
        setMensaje('Error: usuario no definido.');
        setModalVisible(false);
        return;
      }

      const nombreRol = usuario?.rol; // ahora es string

      if (!nombreRol) {
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

      navigate(`/${nombreRol}/Cita-Programada`, {
        state: { cita: citaGuardada, donador },
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);
      if (error.response && error.response.data) {
        console.error('Detalle backend:', error.response.data);
        setMensaje('Error: ' + JSON.stringify(error.response.data));
      } else {
        setMensaje('Error al agendar la cita. Intenta nuevamente.');
      }
      setModalVisible(false);
    }
  };

  const cancelarCita = () => setModalVisible(false);

  if (!donador) return <div className="text-center mt-10 text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg relative">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b border-gray-200 pb-3">
        🩸 Citas del Donador
      </h2>

      {mensaje && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-md flex items-center gap-3 shadow-sm">
          <span className="text-xl">📅</span>
          <p>{mensaje}</p>
        </div>
      )}

      <form onSubmit={handleAgendarClick} className="bg-slate-50 p-6 rounded-md border border-slate-200 shadow-sm space-y-5">
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-300"
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
              <p>¿Deseas confirmar la cita?</p>
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
