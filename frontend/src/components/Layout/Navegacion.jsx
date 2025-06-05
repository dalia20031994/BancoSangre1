import { Link, useNavigate } from 'react-router-dom';
import SubMenu from './SubMenu';
import { Bell } from 'lucide-react';
import { BellRing } from 'lucide-react';
import { PlusCircle } from 'lucide-react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';


const Navegacion = ({ nombreRol, rolUsuario, isMenuOpen, setIsMenuOpen, handleCitasClick }) => {
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center space-x-10 ml-auto text-lg">
      <Link to={`/${nombreRol}/inicio`} className="text-gray-700 hover:text-teal-600 font-semibold">Inicio</Link>

      {rolUsuario !== 'admin' && (
        <Link to={`/${nombreRol}/Historial-Citas`} className="text-gray-700 hover:text-teal-600 font-semibold">
          Mis citas
        </Link>
      )}

      {rolUsuario === 'admin' && (
  <div className="relative">
    <SubMenu nombreRol={nombreRol} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
  </div>
)}

      <button
        onClick={() => {
          if (rolUsuario === 'admin') {
            navigate(`/${nombreRol}/Citas-Donadores`);
          } else {
            handleCitasClick();
          }
        }}
        className="text-gray-700 hover:text-teal-600 font-semibold"
      >
        Citas
      </button>
{rolUsuario === 'admin' && (
  <Link
    to={`/${nombreRol}/Donaciones`}
    className="inline-flex items-center text-gray-700 font-semibold transition-colors duration-300 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
    aria-label="Ir a Reportes de Donaciones"
  >
    <DocumentTextIcon className="h-5 w-5 mr-2" />
    Reportes
  </Link>
)}
      
      
      {rolUsuario === 'admin' && (
  <Link
    to={`/${nombreRol}/crearNotificacion`}
    className="flex items-center gap-1 text-gray-700 hover:text-teal-600 font-semibold"
  >
    <PlusCircle className="w-5 h-5" />
    Solicitar Apoyo
  </Link>
)}
      
      {rolUsuario === 'admin' && (
  <Link
    to={`/${nombreRol}/NotificacionesActivas`}
    className="flex items-center gap-1 text-gray-700 hover:text-teal-600 font-semibold"
  >
    <BellRing className="w-5 h-5" />
    Solicitudes en Curso
  </Link>
)}

      {rolUsuario !== 'admin' && (
        <Link
          to={`/${nombreRol}/MisNotificaciones`}
          className="flex items-center gap-1 text-gray-700 hover:text-teal-600 font-semibold"
        >
          <Bell className="w-5 h-5" />
          Mis Notificaciones
        </Link>
      )}
      <Link
  to={`/${nombreRol}/SeccionPreguntas`}
  className="inline-flex items-center text-gray-700 font-semibold transition-colors duration-300 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
  aria-label="Ir a Guía del Donante"
>
  <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
  Guía del Donante
</Link>

    </nav>
  );
};

export default Navegacion;
