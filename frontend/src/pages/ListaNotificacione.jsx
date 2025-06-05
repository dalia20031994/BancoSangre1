import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function extraerIdDonador(cadena) {
  const match = cadena.match(/\((\d+)\)/);
  return match ? match[1] : null;
}

export default function ListaNotificacionesActivas() {
  const { token } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);
  const [donadoresInfo, setDonadoresInfo] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [indice, setIndice] = useState(0); // índice de notificación actual

  const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) return;

    API.get('/notificaciones/historial/')
      .then(res => {
        setHistorial(res.data);
        setLoading(false);

        const ids = new Set();
        res.data.forEach(n => {
          n.respuestas.forEach(r => {
            const id = extraerIdDonador(r.donador);
            if (id) ids.add(id);
          });
        });

        Promise.all(
          Array.from(ids).map(id =>
            API.get(`/donador/${id}/`)
              .then(resp => [id, resp.data])
              .catch(() => [id, null])
          )
        ).then(results => {
          const info = {};
          results.forEach(([id, data]) => {
            info[id] = data;
          });
          setDonadoresInfo(info);
        });
      })
      .catch(() => {
        setError('Error al cargar historial.');
        setLoading(false);
      });
  }, [token]);

  const notificacionActual = historial[indice];

  if (loading) return <p className="text-center mt-10 text-green-600">Cargando historial...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (historial.length === 0) return <p className="text-center mt-10 text-gray-600">No hay historial disponible.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-green-200">
      <h2 className="text-3xl font-bold mb-6 text-green-700 border-b-2 border-green-300 pb-2 text-center">
        Notificación {indice + 1} de {historial.length}
      </h2>

      <div className="mb-6 p-5 border-l-4 border-green-400 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-lg"><strong className="text-green-800">Título:</strong> {notificacionActual.titulo}</p>
        <p><strong className="text-green-800">Mensaje:</strong> {notificacionActual.mensaje}</p>
        <p><strong className="text-green-800">Tipo de sangre:</strong> {notificacionActual.tipo_sangre}</p>
        <p><strong className="text-green-800">Litros requeridos:</strong> {notificacionActual.litros_requeridos}</p>
        <p><strong className="text-green-800">Fecha creación:</strong> {new Date(notificacionActual.fecha_creacion).toLocaleString()}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-3 text-green-700">Respuestas de donadores:</h3>
          {notificacionActual.respuestas && notificacionActual.respuestas.length > 0 ? (
            notificacionActual.respuestas.map((r, i) => {
              const idDonador = extraerIdDonador(r.donador);
              const infoDonador = idDonador ? donadoresInfo[idDonador] : null;

              const nombreCompleto = infoDonador
                ? [infoDonador.nombre, infoDonador.apellidoP, infoDonador.apellidoM].filter(Boolean).join(' ')
                : null;

              return (
                <div key={i} className="mb-3 p-3 bg-white border border-green-200 rounded-md shadow-sm">
                  <p><strong className="text-green-800">Donador:</strong> {nombreCompleto || `Donador ID ${idDonador}` || r.donador}</p>
                  <p><strong className="text-green-800">Estado:</strong>
                    <span className={`ml-1 font-semibold ${r.estado === 'aceptado' ? 'text-green-600' : 'text-red-500'}`}>
                      {r.estado}
                    </span>
                  </p>
                  <p><strong className="text-green-800">Hora llegada:</strong> {r.hora_llegada ? new Date(r.hora_llegada).toLocaleTimeString() : 'No registrada'}</p>
                  <p><strong className="text-green-800">Fecha respuesta:</strong> {r.fecha_respuesta ? new Date(r.fecha_respuesta).toLocaleString() : 'No registrada'}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No hay respuestas de donadores.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setIndice(prev => Math.max(prev - 1, 0))}
          disabled={indice === 0}
          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-40"
        >
          <ChevronLeft className="mr-2" /> Anterior
        </button>
        <button
          onClick={() => setIndice(prev => Math.min(prev + 1, historial.length - 1))}
          disabled={indice === historial.length - 1}
          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-40"
        >
          Siguiente <ChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}
