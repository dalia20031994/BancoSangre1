import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { ModalConfirmacion } from '../../components/Modales/ModalEliminacion';
import { FiltrosDonadores } from '../../components/Donador/FormComponents/DonadorFiltroGeneral';
import { ListaDonadoresPaginada } from '../../components/Donador/FormComponents/Paginacion';
import { getUsuarios } from '../../api/usuarios.api';
import { getDonadores, eliminarDonador, toggleEstadoDonador } from '../../api/donador.api';

export default function DonadoresList() {
  const { nombreRol } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donadores, setDonadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    estado: '',
    tipoSangre: '',
    sexo: ''
  });
  const [idEliminar, setIdEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  useEffect(() => {
    if (!token) return;

    getUsuarios(token)
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Error al cargar usuarios:', err));
  }, [token]);
  useEffect(() => {
    if (!token) return;

    getDonadores(token, filtros)
      .then(res => {
        const lista = Array.isArray(res.data) ? res.data : res.data.results || [];
        setDonadores(lista);
      })
      .catch(err => console.error('Error al cargar donadores:', err));
  }, [filtros, token]);
  const handleEditar = (id) => {
    navigate(`/${nombreRol}/donadores/editar/${id}`);
  };
  const handleEliminar = (id) => {
    setIdEliminar(id);
    setMostrarModal(true);
  };
  const confirmarEliminacion = () => {
    eliminarDonador(token, idEliminar)
      .then(() => {
        setDonadores(prev => prev.filter(d => d.id !== idEliminar));
        setMostrarModal(false);
        setIdEliminar(null);
      })
      .catch(err => {
        console.error('Error al eliminar donador:', err);
        alert('No se pudo eliminar el donador.');
        setMostrarModal(false);
      });
  };
  const cancelarEliminacion = () => {
    setMostrarModal(false);
    setIdEliminar(null);
  };
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };
  const limpiarFiltros = () => {
    setFiltros({ estado: '', tipoSangre: '', sexo: '' });
  };
  const handleToggleEstado = (id, estadoActual) => {
    toggleEstadoDonador(token, id, estadoActual)
      .then(() => {
        setDonadores(prev =>
          prev.map(donador =>
            donador.id === id ? { ...donador, estado: !estadoActual } : donador
          )
        );
      })
      .catch(err => {
        console.error('Error al cambiar estado:', err);
        alert('No se pudo cambiar el estado del donador.');
      });
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">🩸 Donadores Registrados</h2>
        <FiltrosDonadores
          filtros={filtros}
          onChange={handleFiltroChange}
          onLimpiar={limpiarFiltros}
        />
        {donadores.length > 0 ? (
          <ListaDonadoresPaginada
            donadores={donadores}
            usuarios={usuarios}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onToggleEstado={handleToggleEstado}
          />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No se encontraron donadores con los filtros seleccionados.
          </div>
        )}
        <ModalConfirmacion
          visible={mostrarModal}
          onConfirmar={confirmarEliminacion}
          onCancelar={cancelarEliminacion}
        />
      </div>
    </div>
  );
}
