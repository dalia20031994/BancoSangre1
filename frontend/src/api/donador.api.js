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
// obtiene donador por ID de usuario
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

export const obtenerDonadores = async (token) => {
  const response = await fetch('http://localhost:8000/api/donador/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Error al obtener donadores');
  }

  const donadoresData = await response.json();
  return donadoresData;
};
export const getDonadores = (token, filtros) => {
  // Procesar filtros como en el componente (puedes trasladar la lógica o hacerla fuera)
  let estadoBool;
  if (filtros.estado === '') {
    estadoBool = undefined;
  } else if (filtros.estado === 'Activo') {
    estadoBool = true;
  } else if (filtros.estado === 'Inactivo') {
    estadoBool = false;
  }

  let sexoFiltrado = '';
  if (filtros.sexo === 'Masculino') sexoFiltrado = 'M';
  else if (filtros.sexo === 'Femenino') sexoFiltrado = 'F';

  const params = { ...filtros, estado: estadoBool };

  if (sexoFiltrado) {
    params['usuario__sexo'] = sexoFiltrado;
  }
  delete params.sexo;

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === '') {
      delete params[key];
    }
  });

  return axios.get('http://localhost:8000/api/donador/', {
    headers: { Authorization: `Bearer ${token}` },
    params: params,
  });
};

export const eliminarDonador = (token, id) => {
  return axios.delete(`http://localhost:8000/api/donador/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const toggleEstadoDonador = (token, id, estadoActual) => {
  return axios.patch(`http://localhost:8000/api/donador/${id}/`,
    { estado: !estadoActual },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const fetchDonadores = async (token, filters = {}) => {
  try {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') params[key] = value;
    });

    const response = await axios.get(`${API_BASE_URL}/mapa/donadores/`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Error desconocido');
    }
  } catch (error) {
    // Para mantener consistencia, lanza el error para manejarlo donde se invoque
    throw error.response?.data?.error || error.message || 'Error al cargar donadores';
  }
};