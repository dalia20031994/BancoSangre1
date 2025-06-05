import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

export default function DonadorNotifications() {
  const { token } = useContext(AuthContext);

  const [state, setState] = useState({
    loading: true,
    error: '',
    notificaciones: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!token) {
      setState({
        loading: false,
        error: 'No autorizado. Por favor, inicie sesión.',
        notificaciones: [],
      });
      return;
    }

    const API = axios.create({
      baseURL: 'http://localhost:8000/api',
      headers: { Authorization: `Bearer ${token}` },
    });

    API.get('/notificaciones/mis/')
      .then((res) => {
        setState({ loading: false, error: '', notificaciones: res.data });
      })
      .catch((err) => {
        console.error('Error al cargar notificaciones:', err.response?.data || err.message);
        setState({
          loading: false,
          error: 'Error al cargar notificaciones. Intente de nuevo más tarde.',
          notificaciones: [],
        });
      });
  }, [token]);

  const enviarRespuesta = async (id, aceptada, minutos = null) => {
    let tiempo_llegada_val = null;

    if (aceptada) {
      const fechaLlegada = new Date();
      fechaLlegada.setMinutes(fechaLlegada.getMinutes() + minutos);
      tiempo_llegada_val = fechaLlegada.toISOString();
    }

    try {
      const API = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: { Authorization: `Bearer ${token}` },
      });

      await API.patch(`/notificaciones/${id}/respuesta/`, {
        estado: aceptada ? 'aceptada' : 'rechazada',
        hora_llegada: tiempo_llegada_val,
      });

      setState((prev) => ({
        ...prev,
        notificaciones: prev.notificaciones.map((n) =>
          n.id === id
            ? {
                ...n,
                aceptada: aceptada,
                tiempo_llegada: tiempo_llegada_val,
              }
            : n
        ),
      }));
    } catch (error) {
      console.error('Error al enviar la respuesta:', error.response?.data || error.message);
      alert('Ocurrió un error al enviar la respuesta.');
    }
  };

  const responder = (id, aceptada) => {
    if (aceptada) {
      setSelectedId(id);
      setModalVisible(true);
    } else {
      enviarRespuesta(id, false);
    }
  };

  const formatDateTime = (isoString) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleString('es-MX', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  const ModalTiempo = ({ visible, onClose, onConfirm }) => {
    const [minutos, setMinutos] = useState('');

    if (!visible) return null;

    const handleConfirm = () => {
      const valor = minutos.trim();
      if (valor === '' || isNaN(valor) || parseInt(valor, 10) <= 0) {
        alert('Ingresa un número válido de minutos');
        return;
      }
      onConfirm(parseInt(valor, 10));
      setMinutos('');
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-80 z-50 pointer-events-auto">
          <h3 className="text-lg font-semibold mb-4 text-teal-700">
            ¿En cuántos minutos puedes llegar?
          </h3>
          <input
            type="number"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            placeholder="Ej: 30"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:underline px-3 py-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (state.loading)
    return <p className="text-center mt-10 text-gray-600">Cargando notificaciones...</p>;
  if (state.error)
    return <p className="text-center mt-10 text-red-600">{state.error}</p>;
  if (state.notificaciones.length === 0)
    return <p className="text-center mt-10 text-gray-600">No hay notificaciones para ti en este momento.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold text-teal-700 mb-6 text-center">📬 Notificaciones para ti</h2>
      <div className="space-y-6">
        {state.notificaciones.map((n) => (
          <div
            key={n.id}
            className="bg-white border border-gray-200 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Título:</span> {n.titulo}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Mensaje:</span> {n.mensaje}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Tipo de sangre requerido:</span>{' '}
              <span className="text-red-600">{n.tipo_sangre}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Litros requeridos:</span> {n.litros}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Estado:</span>{' '}
              {n.aceptada === null ? (
                <span className="text-yellow-600 font-medium">Pendiente</span>
              ) : n.aceptada ? (
                <span className="text-green-600 font-medium">Aceptada</span>
              ) : (
                <span className="text-red-600 font-medium">Rechazada</span>
              )}
            </p>
            {n.aceptada && n.tiempo_llegada && (
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Tiempo estimado de llegada:</span>{' '}
                <span className="text-blue-700 font-medium">{formatDateTime(n.tiempo_llegada)}</span>
              </p>
            )}
            {n.aceptada === null && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => responder(n.id, true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  ✅ Confirmar asistencia
                </button>
                <button
                  onClick={() => responder(n.id, false)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  ❌ No puedo asistir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <ModalTiempo
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(minutos) => {
          enviarRespuesta(selectedId, true, minutos);
          setModalVisible(false);
        }}
      />
    </div>
  );
}
