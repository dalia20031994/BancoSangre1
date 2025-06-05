import { Link } from 'react-router-dom';
import { MapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SubMenu = ({ nombreRol, isMenuOpen, setIsMenuOpen }) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(prev => ({ donador: !prev.donador, usuario: false }))}
        className="text-gray-700 hover:text-teal-600 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
        aria-expanded={isMenuOpen.donador}
        aria-haspopup="true"
      >
        Donadores
      </button>
      {isMenuOpen.donador && (
        <div
          className="absolute bg-white shadow-md rounded-md mt-3 py-3 z-50 w-56"
          role="menu"
          aria-label="Submenú Donadores"
        >
          <Link
            to={`/${nombreRol}/Mapa-Donadores`}
            onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <MapIcon className="h-5 w-5 mr-2" />
            Mapa de donadores
          </Link>
          <Link
            to={`/${nombreRol}/Donadores`}
            onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
            className="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Subir donadores
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubMenu;

