import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthAxios = (token) => {
  return axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- para los datos de usuario ---
export const fetchAuthenticatedUser = async (token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/usuario-autenticado/`);
  return response.data;
};
export const fetchUserById = async (userId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/usuarios/${userId}/`);
  return response.data;
};
export const updateUserData = async (userId, userData, token) => {
  const authAxios = getAuthAxios(token);
  const dataToSend = {
    nombre_usuario: userData.nombre_usuario,
    correo: userData.correo,
    sexo: userData.sexo,
    ...(userData.password && { password: userData.password })
  };
  const response = await authAxios.patch(`${API_BASE_URL}/usuarios/${userId}/`, dataToSend);
  return response.data;
};
// --- datos del donador ---
export const fetchDonadorById = async (id, token) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/donador/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching donador:', error);
    throw error;
  }
};
export const fetchDonadorByUserId = async (userId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/donador/usuario/${userId}`);
  return response.data;
};
export const updateDonadorData = async (donadorId, donadorData, idUsuario, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.put(
    `${API_BASE_URL}/donador/${donadorId}/`,
    {
      nombre: donadorData.nombre,
      apellidoP: donadorData.apellidoP,
      apellidoM: donadorData.apellidoM,
      edad: donadorData.edad,
      primeraDonacion: donadorData.primeraDonacion || "1900-01-01",
      ultimaDonacion: donadorData.ultimaDonacion || "1900-01-01",
      tipoSangre: donadorData.tipoSangre,
      peso: donadorData.peso,
      telefonoUno: donadorData.telefonoUno,
      telefonoDos: donadorData.telefonoDos || null,
      estado: donadorData.estado,
      direccion: donadorData.direccion,
      usuario: idUsuario
    }
  );
  return response.data;
};