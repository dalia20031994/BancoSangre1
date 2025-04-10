import { FaUser } from 'react-icons/fa';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

export function PaginaLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* el encabezado */}
      <div className="bg-teal-700 text-white p-2 text-center text-sm">
        Dirección: 68000, C. de Los Libres 406-a, 68000 Centro, Oax.
      </div>

      {/* Barra de navegación con logo */}
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700 leading-tight">Banco de Sangre</h1>
            <p className="text-[16px] text-gray-600 font-bold">Ángeles</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative">
        <img
          src="/doctor.png"
          alt="Doctor"
          className="w-full h-[calc(100vh-96px)] object-cover brightness-75"
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
              Iniciar Sesión
            </h2>

            <form>
              <div className="mb-4 relative">
                <label className="block text-gray-700 mb-2 font-medium">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Usuario"
                  />
                </div>
              </div>
              <div className="mb-4 relative">
      <label className="block text-gray-700 mb-2 font-medium">
        Contraseña
      </label>
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="**********"
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
              <a href="#" className="font-bold hover:underline">Registrarse</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}