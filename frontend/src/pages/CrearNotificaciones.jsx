import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

export default function CrearNotificacionForm() {
  const { token } = useContext(AuthContext);
  const [tipoSangre, setTipoSangre] = useState('');
  const [litros, setLitros] = useState('');
  const [donadores, setDonadores] = useState([]);
  const [selectedDonadores, setSelectedDonadores] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [mensajeNoti, setMensajeNoti] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) return;
    API.get('/donador/')
      .then(res => setDonadores(res.data))
      .catch(() => setError('Error al cargar donadores'));
  }, [token]);

  const toggleDonador = (id) => {
    setSelectedDonadores(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const calcularDonadoresNecesarios = () => {
    const litrosNum = parseFloat(litros);
    if (!litrosNum || litrosNum <= 0) return 0;
    return Math.ceil(litrosNum / 0.5);
  };

  const donadoresFiltrados = tipoSangre
    ? donadores.filter(d => d.tipoSangre.toLowerCase() === tipoSangre.toLowerCase())
    : [];

  useEffect(() => {
    setSelectedDonadores([]);
  }, [tipoSangre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!titulo || !mensajeNoti || !tipoSangre || !litros || selectedDonadores.length === 0) {
      setError('Complete todos los campos y seleccione al menos un donador.');
      return;
    }

    const minDonadores = calcularDonadoresNecesarios();
    if (selectedDonadores.length < minDonadores) {
      setError(`Debe seleccionar al menos ${minDonadores} donadores para cubrir ${litros} litros.`);
      return;
    }

    try {
      await API.post('/notificaciones/crear/', {
        titulo,
        mensaje: mensajeNoti,
        tipo_sangre: tipoSangre,
        litros: parseFloat(litros),
        donadores_ids: selectedDonadores,
      });
      setMensaje('Notificación enviada correctamente.');
      setTitulo('');
      setMensajeNoti('');
      setTipoSangre('');
      setLitros('');
      setSelectedDonadores([]);
    } catch (error) {
      setError('Error al enviar la notificación.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">Crear Notificación</h2>
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="mensajeNoti">Mensaje</label>
        <textarea
          id="mensajeNoti"
          value={mensajeNoti}
          onChange={e => setMensajeNoti(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="tipoSangre">Tipo de sangre</label>
        <select
          id="tipoSangre"
          value={tipoSangre}
          onChange={e => setTipoSangre(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="">Seleccione tipo de sangre</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label className="block mb-2 font-semibold" htmlFor="litros">Litros requeridos</label>
        <input
          id="litros"
          type="number"
          step="0.1"
          min="0.5"
          value={litros}
          onChange={e => setLitros(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Ej: 1.5"
          required
        />

        <p className="mb-2 font-semibold">
          Seleccione donadores {tipoSangre ? `(tipo ${tipoSangre})` : ''}
          {' '} (mínimo {calcularDonadoresNecesarios()})
        </p>
        <div className="max-h-48 overflow-auto mb-4 border rounded p-2">
          {tipoSangre === '' ? (
            <p className="text-gray-500">Seleccione un tipo de sangre para ver donadores disponibles.</p>
          ) : donadoresFiltrados.length === 0 ? (
            <p className="text-gray-500">No hay donadores disponibles para este tipo de sangre.</p>
          ) : (
            donadoresFiltrados.map(donador => (
              <div key={donador.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`donador-${donador.id}`}
                  checked={selectedDonadores.includes(donador.id)}
                  onChange={() => toggleDonador(donador.id)}
                  className="mr-2"
                />
                <label htmlFor={`donador-${donador.id}`}>
                  {donador.nombre} - {donador.tipoSangre}
                </label>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Enviar Notificación
        </button>
      </form>
    </div>
  );
}
