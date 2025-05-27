// cita.api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/cita/';

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
