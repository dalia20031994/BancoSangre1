import axios from 'axios';
/*Permite generar al token al mandarle el correo y contraseña de un usuario registrado*/ 
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const loginRequest = (correo, password) => {
   return axios.post(`${API_BASE_URL}/token/`, {
     correo,
     password,
   }, {
     headers: {
       'Content-Type': 'application/json',
     },
   });
 };
export const getAuthenticatedUser = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/usuario-autenticado/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserById = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL}/usuarios/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserData = async (userId, userData, token, isDonador = false) => {
  const url = isDonador
    ? `${API_BASE_URL}/donador/usuarios/${userId}/`
    : `${API_BASE_URL}/usuarios/${userId}/`;

  const response = await axios.patch(url, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};