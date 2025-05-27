import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import Footer from './Footer';
import axios from 'axios';

const Encabezado = () => {
  const { nombreRol } = useParams();
  const { token, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState({ donador: false, usuario: false });
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [donadorId, setDonadorId] = useState(null); // Para guardar id donador
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsuarioAutenticado = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rol = res.data.rol?.toLowerCase();
        const usuario = res.data.nombre_usuario;

        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setRolUsuario(rol);

          // Si es donador, obtener su id para buscar citas
          if (rol === 'donador') {
            const donadorRes = await axios.get(`http://127.0.0.1:8000/api/donador/usuario/${res.data.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setDonadorId(donadorRes.data.id);
          }
        }
      } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
      }
    };

    fetchUsuarioAutenticado();
  }, [token, nombreRol]);

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

  const userInitial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    setIsMenuOpen({ donador: false, usuario: false });
    navigate('/login', { replace: true });
  };

  // NUEVA FUNCION: Maneja el click en "Citas" para donadores
  const handleCitasClick = async () => {
    if (rolUsuario !== 'donador') {
      // No es donador, navega normal a /citas
      navigate(`/${nombreRol}/citas`);
      return;
    }

    try {
      // Consulta las citas pendientes del donador
      const res = await axios.get(`http://127.0.0.1:8000/api/cita/donador/${donadorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar citas pendientes
      const citasPendientes = res.data.filter(cita => cita.estado === 'pendiente');

      if (citasPendientes.length > 0) {
        // Tiene cita pendiente, navegar a Cita-Programada con datos (puedes pasar por state)
        navigate(`/${nombreRol}/Cita-Programada`, {
          state: { cita: citasPendientes[0] }, // Asume la primera cita pendiente
        });
      } else {
        // No tiene citas pendientes, navegar a citas normal
        navigate(`/${nombreRol}/citas`);
      }
    } catch (error) {
      console.error('Error al obtener las citas del donador:', error);
      // En caso de error, navegar a citas normal
      navigate(`/${nombreRol}/citas`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Encabezado fijo */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full flex items-center px-6 py-4">

          {/* Logo y título */}
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="Logo" className="h-16" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-teal-700 leading-tight">Banco de Sangre</h1>
              <p className="text-lg text-gray-600 font-bold">Ángeles</p>
            </div>
          </div>

          {/* Botón hamburguesa en móviles */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="text-gray-700 focus:outline-none text-3xl"
            >
              ☰
            </button>
          </div>

          {/* Menú horizontal en pantallas medianas+ */}
          <nav className="hidden md:flex items-center space-x-10 ml-auto text-lg">
            <Link to={`/${nombreRol}/inicio`} className="text-gray-700 hover:text-teal-600 font-semibold">Inicio</Link>

            {/* Mostrar "Mis citas" solo si NO es admin */}
            {rolUsuario !== 'admin' && (
              <Link to={`/${nombreRol}/Historial-Citas`} className="text-gray-700 hover:text-teal-600 font-semibold">
                Mis citas
              </Link>
            )}

            {rolUsuario === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(prev => ({ donador: !prev.donador, usuario: false }))}
                  className="text-gray-700 hover:text-teal-600 font-semibold"
                >
                  Donadores
                </button>
                {isMenuOpen.donador && (
                  <div className="absolute bg-white shadow-md rounded-md mt-3 py-3 z-50 w-52">
                    <Link to={`/${nombreRol}/Mapa-Donadores`} onClick={() => setIsMenuOpen({ donador: false, usuario: false })} className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100">
                      Mapa de donadores
                    </Link>
                    <Link to={`/${nombreRol}/Donadores`} onClick={() => setIsMenuOpen({ donador: false, usuario: false })} className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100">
                      Administrar donadores
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Cambia la lógica para "Citas" según rol */}
            <button
              onClick={() => {
                if (rolUsuario === 'admin') {
                  navigate(`/${nombreRol}/Citas-Donadores`);
                } else {
                  navigate(`/${nombreRol}/citas`);
                }
              }}
              className="text-gray-700 hover:text-teal-600 font-semibold"
            >
              Citas
            </button>
            <Link to={`/${nombreRol}/SeccionPreguntas`} className="text-gray-700 hover:text-teal-600 font-semibold">Guía del  Donante</Link>
          </nav>
          

          {/* Avatar del usuario */}
          {token && (
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
          )}
          

        </div>

        {/* Menú desplegable en móviles */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col space-y-3 px-6 pb-6 text-lg">
              <Link to={`/${nombreRol}/inicio`} className="text-gray-700 hover:text-teal-600">Inicio</Link>
              {rolUsuario === 'admin' && (
                <>
                  <Link to={`/${nombreRol}/Mapa-Donadores`} className="text-gray-700 hover:text-teal-600">Mapa de donadores</Link>
                  <Link to={`/${nombreRol}/Donadores`} className="text-gray-700 hover:text-teal-600">Administrar donadores</Link>
                </>
              )}
              {/* Botón Citas con lógica según rol */}
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
        )}
      </header>

      {/* contenido principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Encabezado;
