import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api';
import { fetchCitasPorDonador } from '../../api/citas.api';
import Footer from './Footer';
import HeaderLogo from './Header';
import Navegacion from './Navegacion';
import Avatar from './Avatar';
import MobileMenu from './MenuMovil';

const Encabezado = () => {
  const { nombreRol } = useParams();
  const { token, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState({ donador: false, usuario: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [donadorId, setDonadorId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsuarioAutenticado = async () => {
      if (!token) return;
      try {
        const userData = await getAuthenticatedUser(token);
        const rol = userData.rol?.toLowerCase();
        const usuario = userData.nombre_usuario;
        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setRolUsuario(rol);
          if (rol === 'donador') {
            const donadorData = await fetchDonadorByUserId(userData.id, token);
            setDonadorId(donadorData.id);
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
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'];
    return colors[nombreUsuario.charCodeAt(0) % colors.length];
  }, [nombreUsuario]);
  const userInitial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : 'U';
  const handleLogout = () => {
    logout();
    setIsMenuOpen({ donador: false, usuario: false });
    navigate('/login', { replace: true });
  };
  const handleCitasClick = async () => {
    if (rolUsuario !== 'donador') {
      navigate(`/${nombreRol}/citas`);
      return;
    }
    try {
      const citas = await fetchCitasPorDonador(donadorId, token);
      const citasPendientes = citas.filter(cita => cita.estado === 'pendiente');

      if (citasPendientes.length > 0) {
        navigate(`/${nombreRol}/Cita-Programada`, {
          state: { cita: citasPendientes[0] },
        });
      } else {
        navigate(`/${nombreRol}/citas`);
      }
    } catch (error) {
      console.error('Error al obtener las citas del donador:', error);
      navigate(`/${nombreRol}/citas`);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full flex items-center px-6 py-4">
          <HeaderLogo />

          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="text-gray-700 focus:outline-none text-3xl"
            >
              ☰
            </button>
          </div>
          <Navegacion
            nombreRol={nombreRol}
            rolUsuario={rolUsuario}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            handleCitasClick={handleCitasClick}
          />
          {token && (
            <Avatar
              nombreUsuario={nombreUsuario}
              rolUsuario={rolUsuario}
              nombreRol={nombreRol}
              avatarColor={avatarColor}
              userInitial={userInitial}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              handleLogout={handleLogout}
            />
          )}
        </div>
        {isMobileMenuOpen && (
          <MobileMenu
            nombreRol={nombreRol}
            rolUsuario={rolUsuario}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleCitasClick={handleCitasClick}
            handleLogout={handleLogout}
          />
        )}
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Encabezado;
