import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import { Pencil, Trash2, Save, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const CitasAdmin = () => {
  const { token } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [donadores, setDonadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    fecha: '',
    hora: '',
    estado: '',
    donador: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // New state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null); // To store the ID of the cita to be deleted

  // Filters state
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTipoSangre, setFiltroTipoSangre] = useState('');

  // Pagination state - Reduced to 3 per page as requested implicitly by the original request
  const [currentPage, setCurrentPage] = useState(1);
  const [citasPerPage] = useState(3); // Changed to 3 appointments per page

  // Fetches appointment data from the API
  const fetchCitas = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/api/cita/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedCitas = res.data.sort((a, b) => {
        const dateTimeA = new Date(`${a.fecha}T${a.hora}`);
        const dateTimeB = new Date(`${b.fecha}T${b.hora}`);
        return dateTimeB - dateTimeA;
      });
      setCitas(sortedCitas);
      setError(null);
    } catch (err) {
      setError('Error al cargar las citas');
      console.error('Error fetching citas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetches donor data from the API
  const fetchDonadores = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donador', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonadores(res.data);
    } catch (err) {
      console.error('Error al cargar donadores:', err);
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchDonadores();
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mostrarErroresConsola = (errorData) => {
    if (typeof errorData === 'object') {
      Object.entries(errorData).forEach(([campo, errores]) => {
        console.error(`Error en '${campo}':`, errores.join(' | '));
      });
    } else {
      console.error('Error desconocido:', errorData);
    }
  };

  const actualizarCita = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/cita/${formData.id}/`, {
        ...formData,
        donador: Number(formData.donador)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCitas();
      resetForm();
      setShowConfirmModal(false);
    } catch (err) {
      alert('Error al actualizar la cita. Verifique los datos.');
      mostrarErroresConsola(err.response?.data || err.message);
      setShowConfirmModal(false);
    }
  };

  // Modified eliminarCita to show modal
  const eliminarCita = (id) => {
    setCitaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminarCita = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cita/${citaToDelete}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCitas();
      setShowDeleteModal(false); // Close the modal
      setCitaToDelete(null); // Clear the citaToDelete state
    } catch (err) {
      alert('Error al eliminar la cita.');
      console.error('Error deleting cita:', err);
      setShowDeleteModal(false); // Close the modal even on error
      setCitaToDelete(null); // Clear the citaToDelete state
    }
  };

  const editarCita = (cita) => {
    const estadoValido = ['pendiente', 'completada', 'cancelada'].includes(
      cita.estado?.toLowerCase()
    ) ? cita.estado.toLowerCase() : 'pendiente';

    setFormData({
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: estadoValido,
      donador: typeof cita.donador === 'object' ? cita.donador.id : cita.donador
    });
    setIsEditing(true);
    window.scrollTo({
      top: document.getElementById('edit-form-section')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  const resetForm = () => {
    setFormData({ id: null, fecha: '', hora: '', estado: '', donador: '' });
    setIsEditing(false);
    setShowConfirmModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setShowConfirmModal(true);
    }
  };

  const citasFiltradas = useMemo(() => {
    return citas.filter(cita => {
      const coincideFecha = !filtroFecha || cita.fecha === filtroFecha;
      const donadorIdDeCita = typeof cita.donador === 'object'
        ? cita.donador.id
        : cita.donador;
      const donadorEncontrado = donadores.find(d => d.id === donadorIdDeCita);
      const tipoSangre = donadorEncontrado ? donadorEncontrado.tipoSangre : null;
      const coincideTipoSangre = !filtroTipoSangre || (tipoSangre && tipoSangre.toLowerCase() === filtroTipoSangre.toLowerCase());
      return coincideFecha && coincideTipoSangre;
    });
  }, [citas, donadores, filtroFecha, filtroTipoSangre]);

  // Pagination logic
  const indexOfLastCita = currentPage * citasPerPage;
  const indexOfFirstCita = indexOfLastCita - citasPerPage;
  const currentCitas = citasFiltradas.slice(indexOfFirstCita, indexOfLastCita);

  const totalPages = Math.ceil(citasFiltradas.length / citasPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Reduced Title Size */}
      <h2 className="text-2xl font-extrabold mb-6 text-center text-teal-800 tracking-tight">
        Administrar Citas de Donación
      </h2>

      {/* Filters Section */}
      <div className="mb-8 p-4 rounded-xl shadow-lg bg-white border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Filtros de Citas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="filtroFecha">
              Filtrar por Fecha
            </label>
            <input
              type="date"
              id="filtroFecha"
              value={filtroFecha}
              onChange={e => {
                setFiltroFecha(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="filtroTipoSangre">
              Filtrar por Tipo de Sangre
            </label>
            <select
              id="filtroTipoSangre"
              value={filtroTipoSangre}
              onChange={e => {
                setFiltroTipoSangre(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            >
              <option value="">-- Todos --</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Edit Form Section - Conditionally rendered */}
      {isEditing && (
        <div id="edit-form-section" className="mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 animate-fade-in-down">
          <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">
            Editar Cita
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="hora">Hora</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="">-- Seleccionar --</option>
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="donador">Donador</label>
              <select
                id="donador"
                name="donador"
                value={formData.donador}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="">-- Seleccionar donador --</option>
                {donadores.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre} ({d.tipoSangre})</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transition duration-300 transform hover:scale-105"
              >
                <Save size={18} /> Actualizar Cita
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center gap-2 transition duration-300 transform hover:scale-105"
              >
                <XCircle size={18} /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal (for editing) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold mb-5 text-center text-gray-800">Confirmar Actualización</h3>
            <p className="mb-7 text-center text-gray-700">¿Estás seguro de que quieres actualizar esta cita con los nuevos datos?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarCita}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold mb-5 text-center text-red-700">Confirmar Eliminación</h3>
            <p className="mb-7 text-center text-gray-700">
              ¿Estás seguro de que quieres eliminar esta cita? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCitaToDelete(null);
                }}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarCita}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Listado de Citas</h3>
        {loading ? (
          <p className="text-center text-gray-600 text-lg py-10">Cargando citas...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg py-10 font-medium">{error}</p>
        ) : citasFiltradas.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">No hay citas que coincidan con los filtros.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Hora
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Donador (Tipo Sangre)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCitas.map((cita) => { // Render only currentCitas for pagination
                    const donadorParaMostrar = typeof cita.donador === 'object'
                      ? cita.donador
                      : donadores.find(d => d.id === cita.donador);

                    let estadoBadgeClass = '';
                    switch (cita.estado?.toLowerCase()) {
                      case 'pendiente':
                        estadoBadgeClass = 'bg-yellow-100 text-yellow-800';
                        break;
                      case 'completada':
                        estadoBadgeClass = 'bg-green-100 text-green-800';
                        break;
                      case 'cancelada':
                        estadoBadgeClass = 'bg-red-100 text-red-800';
                        break;
                      default:
                        estadoBadgeClass = 'bg-gray-100 text-gray-800';
                    }

                    return (
                      <tr key={cita.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cita.hora}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoBadgeClass} capitalize`}>
                            {cita.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {donadorParaMostrar
                            ? `${donadorParaMostrar.nombre} (${donadorParaMostrar.tipoSangre})`
                            : 'Desconocido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => editarCita(cita)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                              title="Editar Cita"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => eliminarCita(cita.id)} // This now opens the delete modal
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                              title="Eliminar Cita"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200
                      ${currentPage === page
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CitasAdmin;