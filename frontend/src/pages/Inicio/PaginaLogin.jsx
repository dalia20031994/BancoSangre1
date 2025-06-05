//pagina donde el usuario ingresa sus datos para iniciar sesion
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api';
import { AuthContext } from '../../auth/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import doctorImg from '../../assets/doctor.png';
import logoImg from '../../assets/logo.png';

export function PaginaLogin() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //obtener token
      const res = await loginRequest(correo, contrasena);
      if (!res.data?.access) {
        alert('No se recibió token en la respuesta.');
        return;
      }
      const token = res.data.access;
      login(token);
      //Obtener usuario autenticado 
      const userData = await getAuthenticatedUser(token);
      const rol = userData.rol?.toLowerCase();
      if (rol === 'donador') {
        try {
          //Verificar si el donador tiene registro 
          await fetchDonadorByUserId(userData.id, token);
        } catch (err) {
          if (err.response?.status === 404) {
            // Donador no registrado: redirigir a completar registro
            navigate(`/${rol}/CompletarRegistro`);
            return;
          } else {
            throw err;
          }
        }
      }
      // Redirigir a la página de inicio según rol
      navigate(`/${rol}/inicio`);
    } catch (error) {
      console.error(error);
      alert('Correo o contraseña incorrectos o hubo un error inesperado.');
    }
  };
  return (
    <div className="min-h-screen bg-teal-700">
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src={logoImg} alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700">Banco de Sangre</h1>
            <p className="text-[16px] text-gray-600 font-bold">Ángeles</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <img
          src={doctorImg}
          alt="Doctor"
          className="w-full h-[calc(100vh-96px)] object-cover brightness-75"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Correo electrónico</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Correo electrónico"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="**********"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition duration-200 mb-4"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
          <div className="text-center mt-4 text-white">
            <p>
              ¿No tienes una cuenta?{' '}
              <a href="/registro" className="font-bold hover:underline">
                Registrarse
              </a>
            </p>
          </div>
        </div>
        <footer className="bg-teal-700 text-white p-4 mt-8 text-center">
          <p>Dirección: 68000, C. de Los Libres 406-a, 68000 Centro, Oax.</p>
          <p>&copy; 2025 Banco de Sangre Ángeles | Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
