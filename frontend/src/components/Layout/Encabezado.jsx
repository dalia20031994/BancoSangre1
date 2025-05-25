/*incluye el menu horizontal */
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import Footer from './Footer';
import axios from 'axios';

const Encabezado = () => {
  const { nombreRol } = useParams();
  const { token, logout } = useContext(AuthContext);
  // Estado para manejar menús desplegables: donador y usuario
  const [isMenuOpen, setIsMenuOpen] = useState({ donador: false, usuario: false });
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const navigate = useNavigate();

  // obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUsuarioAutenticado = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rol = res.data.rol?.toLowerCase();
        const usuario = res.data.nombre_usuario;

        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setRolUsuario(rol);
        }
      } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
      }
    };

    fetchUsuarioAutenticado();
  }, [token, nombreRol]);

  // para generar un color aleatorio basado en el nombre del usuario
  const avatarColor = useMemo(() => {
    if (!nombreUsuario) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ];
    
    const charCode = nombreUsuario.charCodeAt(0);
    return colors[charCode % colors.length];
  }, [nombreUsuario]);

  // para tener la primera letra del nombre
  const userInitial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    setIsMenuOpen({ donador: false, usuario: false });
    // dirigir al login y reemplazar el historial para no poder volver atrás cuando se cierra sesion
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Encabezado fijo */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-12" />
            <div className="text-center">
              <h1 className="text-lg font-bold text-teal-700 leading-tight">Banco de Sangre</h1>
              <p className="text-[16px] text-gray-600 font-bold">Ángeles</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Menú horizontal */}
            <nav className="flex items-center space-x-6">
              <Link 
                to={`/${nombreRol}/inicio`}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Inicio
              </Link>

              {/* Donador con submenú que se abre con clic */}
               {rolUsuario === 'admin' && (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(prev => ({
          donador: !prev.donador,
          usuario: false
        }))}
        className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
      >
        Donadores
      </button>

      {isMenuOpen.donador && (
        <div className="absolute bg-white shadow-md rounded-md mt-2 py-2 z-50 w-48">
          <Link
            to={`/${nombreRol}/Mapa-Donadores`}
            onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Mapa de donadores
          </Link>
          <Link
            to={`/${nombreRol}/Donadores`}
            onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Administrar donadores
          </Link>
        </div>
      )}
    </div>
  )}

              <Link 
                to={`/${nombreRol}/citas`}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Citas
              </Link>
            </nav>

            {/* avatar y menu desplegable del usuario */}
            {token && (
              <div className="relative ml-4">
                <button 
                  onClick={() => setIsMenuOpen(prev => ({
                    usuario: !prev.usuario,
                    donador: false
                  }))}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${avatarColor} text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                  aria-label="Menú de usuario"
                >
                  {userInitial}
                </button>

                {isMenuOpen.usuario && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={
                        rolUsuario === 'donador' 
                          ? `/${nombreRol}/editar-perfil-donador` 
                          : `/${nombreRol}/editar-perfil-usuario`
                      }
                      onClick={() => setIsMenuOpen({ donador: false, usuario: false })}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Editar perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* contenido principal*/}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Encabezado;
