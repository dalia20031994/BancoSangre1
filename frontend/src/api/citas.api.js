import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/cita/';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthAxios = (token) => {
  return axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const obtenerCitas = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Aquí asumo que la API devuelve un array de citas
};

export const crearCita = async (cita, token) => {
  const response = await axios.post(API_URL, cita, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Devuelve la cita creada desde el backend
};

export const fetchCitasPorDonador = async (donadorId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/cita/donador/${donadorId}`);
  return response.data;
};

export const cancelarCita = async (citaId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.patch(`/cita/${citaId}/`, {
    estado: 'cancelada',
  });
  return response.data;
};
// Actualizar cita completa (por ejemplo para edición general)
export const actualizarCita = async (citaId, datos, token) => {
  const response = await axios.put(`${API_BASE_URL}/cita/${citaId}/`, datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Eliminar una cita
export const eliminarCita = async (citaId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/cita/${citaId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};