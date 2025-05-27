import axios from 'axios';
//la base de la api
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const getAuthAxios = (token) => {
  return axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
};
// --- para direccion ---
export const fetchDireccionById = async (direccionId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/direccion/${direccionId}/`);
  return response.data;
};
export const updateDireccionData = async (direccionId, direccionData, coloniaId, coordenadasId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.put(
    `${API_BASE_URL}/direccion/${direccionId}/`,
    {
      calle: direccionData.calle,
      numInterior: direccionData.numeroInterior || null,
      numExterior: direccionData.numeroExterior,
      colonia: coloniaId,
      coordenadas: coordenadasId
    }
  );
  return response.data;
};
export const createDireccionData = async (direccionData, coloniaId, coordenadasId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.post(
    `${API_BASE_URL}/direccion/`,
    {
      calle: direccionData.calle,
      numInterior: direccionData.numeroInterior || null,
      numExterior: direccionData.numeroExterior,
      colonia: coloniaId,
      coordenadas: coordenadasId
    }
  );
  return response.data;
};
export const verifyMunicipioExists = async (nombreMunicipio, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/municipio/`);
  return response.data.find(m => m.nombre.toLowerCase() === nombreMunicipio.toLowerCase())?.id || null;
};
export const createMunicipio = async (nombreMunicipio, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.post(
    `${API_BASE_URL}/municipio/`,
    { nombre: nombreMunicipio }
  );
  return response.data.id;
};
export const verifyColoniaExists = async (nombreColonia, municipioId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/colonia/`);
  return response.data.find(c =>
    c.nombre.toLowerCase() === nombreColonia.toLowerCase() &&
    c.municipio === municipioId
  )?.id || null;
};
export const createColonia = async (nombreColonia, municipioId, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.post(
    `${API_BASE_URL}/colonia/`,
    { nombre: nombreColonia, municipio: municipioId }
  );
  return response.data.id;
};
export const fetchColoniaById = async (coloniaId, token) => {
    const authAxios = getAuthAxios(token);
    const response = await authAxios.get(`${API_BASE_URL}/colonia/${coloniaId}/`);
    return response.data;
};
export const verifyCoordenadasExists = async (latitud, longitud, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get(`${API_BASE_URL}/coordenada/`);
  return response.data.find(coord =>
    Math.abs(coord.latitud - latitud) < 0.0001 &&
    Math.abs(coord.longitud - longitud) < 0.0001
  )?.id || null;
};
export const createCoordenadas = async (latitud, longitud, token) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.post(
    `${API_BASE_URL}/coordenada/`,
    { latitud, longitud }
  );
  return response.data.id;
};
export const fetchCoordenadaById = async (coordenadaId, token) => {
    const authAxios = getAuthAxios(token);
    const response = await authAxios.get(`${API_BASE_URL}/coordenada/${coordenadaId}/`);
    return response.data;
};