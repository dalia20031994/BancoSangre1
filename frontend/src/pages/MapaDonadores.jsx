// Para mostrar completa la pagina donde se muestra el mapa y los filtos
import React, { useEffect, useState, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import DonadorMapa from '../components/Donador/Icono/DonadorMapa';
import FiltroDonadores from '../components/Donador/Filtros/DonadorFiltro';
const MapaDonadores = () => {
  const { token } = useContext(AuthContext);
  const [map, setMap] = useState(null);
  const [donadores, setDonadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tipo_sangre: '',
    sexo: '',
    edad_min: '',
    edad_max: ''
  });
  const fetchDonadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') params[key] = value;
      });
      const res = await axios.get('http://127.0.0.1:8000/api/mapa/donadores/', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setDonadores(res.data);
      } else {
        throw new Error(res.data?.error || 'Error desconocido');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.error || error.message || 'Error al cargar donadores');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const mapInstance = L.map('map').setView([17.0732, -96.7266], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);
    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);
  useEffect(() => {
    if (!map || loading) return;
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    donadores.forEach(d => {
      if (!d.coordenadas || !d.coordenadas.lat || !d.coordenadas.lng) {
        console.warn("Donador sin coordenadas válidas:", d);
        return;
      }
      L.marker([d.coordenadas.lat, d.coordenadas.lng], {
        icon: DonadorMapa({ tipoSangre: d.tipoSangre })
      })
      .addTo(map)
      .bindPopup(`
        <div class="w-[260px] font-sans text-[#2c3e50] p-4">
          <div class="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-xl shadow-md">
            <h3 class="m-0 mb-1 text-lg font-semibold text-purple-900">${d.nombre}</h3>
          </div>
          <div class="mt-3 text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p class="m-0 text-sm text-gray-700">
              <span class="font-bold text-red-700">${d.tipoSangre}</span> &bull; 
              ${d.edad} años &bull; 
              ${d.sexo === 'M' ? 'Masculino' : 'Femenino'}
            </p>
            <p class="my-1"><strong>📆 Primera donación:</strong> 
              <span class="${d.primeraDonacion === '1900-01-01' ? 'text-red-800' : 'text-green-700'}">
                ${d.primeraDonacion === '1900-01-01' ? 'No realizada' : d.primeraDonacion}
              </span>
            </p>
            <p class="my-1"><strong>🩸 Última donación:</strong> 
              <span class="${d.ultimaDonacion === '1900-01-01' ? 'text-red-800' : 'text-green-700'}">
                ${d.ultimaDonacion === '1900-01-01' ? 'No realizada' : d.ultimaDonacion}
              </span>
            </p>
          </div>
          <div class="mt-3 text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p class="my-1"><strong>📞 Teléfono:</strong> 
              <a href="tel:${d.telefono}" class="text-blue-700 hover:underline">${d.telefono}</a>
            </p>
            <p class="my-1"><strong>📧 Correo:</strong> 
              <a href="tel:${d.correo}" class="text-blue-700 hover:underline">${d.correo}</a>
            </p>
          </div>
        </div>
      `);
    });
  }, [donadores, map, loading]);
  useEffect(() => { 
    if (token) fetchDonadores();
  }, [token]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDonadores();
  };
  if (!token) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        Por favor inicia sesión para acceder a esta función.
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Panel de Filtros */}
      <div className="bg-white p-6 shadow-md border-b border-gray-200">
        <FiltroDonadores 
          filters={filters}
          loading={loading}
          handleFilterChange={handleFilterChange}
          handleSubmit={handleSubmit}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
      {/* Mapa */}
      <div id="map" className="flex-grow relative rounded-b-lg overflow-hidden shadow-inner">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="p-4 bg-white rounded shadow-lg text-gray-800 font-medium">
              Cargando donadores...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MapaDonadores;