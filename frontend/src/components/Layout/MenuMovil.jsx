import { Link, useNavigate } from 'react-router-dom';

const MobileMenu = ({ nombreRol, rolUsuario, setIsMobileMenuOpen, handleCitasClick, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden bg-white shadow-md">
      <nav className="flex flex-col space-y-3 px-6 pb-6 text-lg">
        <Link to={`/${nombreRol}/inicio`} className="text-gray-700 hover:text-teal-600">Inicio</Link>

        {rolUsuario === 'admin' && (
          <>
            <Link to={`/${nombreRol}/Mapa-Donadores`} className="text-gray-700 hover:text-teal-600">Mapa de donadores</Link>
            <Link to={`/${nombreRol}/Donadores`} className="text-gray-700 hover:text-teal-600">Administrar donadores</Link>
          </>
        )}

        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            if (rolUsuario === 'admin') {
              navigate(`/${nombreRol}/Citas-Donadores`);
            } else {
              handleCitasClick();
            }
          }}
          className="text-gray-700 hover:text-teal-600 text-left"
        >
          Citas
        </button>

        <hr />
        <Link to={rolUsuario === 'donador' ? `/${nombreRol}/editar-perfil-donador` : `/${nombreRol}/editar-perfil-usuario`} className="text-gray-700 hover:text-teal-600">Editar perfil</Link>
        <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-500">Cerrar sesión</button>
      </nav>
    </div>
  );
};

export default MobileMenu;
