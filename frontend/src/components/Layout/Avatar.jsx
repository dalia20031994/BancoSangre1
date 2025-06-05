import { Link} from 'react-router-dom';

const Avatar = ({ nombreUsuario, rolUsuario, nombreRol, avatarColor, userInitial, isMenuOpen, setIsMenuOpen, handleLogout }) => {
  return (
    <div className="relative ml-6">
      <button
        onClick={() => setIsMenuOpen(prev => ({ usuario: !prev.usuario, donador: false }))}
        className={`w-14 h-14 rounded-full ${avatarColor} text-white font-bold text-xl flex items-center justify-center`}
      >
        {userInitial}
      </button>
      {isMenuOpen.usuario && (
        <div className="absolute right-0 mt-3 w-52 bg-white rounded-md shadow-lg py-2 z-50">
          <Link
            to={rolUsuario === 'donador' ? `/${nombreRol}/editar-perfil-donador` : `/${nombreRol}/editar-perfil-usuario`}
            onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
            className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
          >
            Editar perfil
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
