/*Pagina principal muestra contenido de acuerdo al rol*/
import { useParams, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

export function Inicio() {
  const { token } = useContext(AuthContext);
  const { nombreRol } = useParams(); // <-- ahora usamos el rol
  const [esValido, setEsValido] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const fetchUsuarioAutenticado = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/usuario-autenticado/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rol = res.data.rol?.toLowerCase(); // Aseguramos consistencia
        const usuario = res.data.nombre_usuario;

        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setEsValido(true);
        } else {
          setEsValido(false);
        }
      } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
        setEsValido(false);
      }
    };

    fetchUsuarioAutenticado();
  }, [token, nombreRol]);

  if (esValido === null) {
    return <div className="text-center mt-10 text-lg text-gray-700">Cargando...</div>;
  }

  if (!esValido) {
    return <Navigate to="/login" replace />;
  }
  const mensajesPorRol = {
    donador: {
      titulo: `¡Gracias por salvar vidas, ${nombreUsuario}!`,
      subtitulo: "Tu donación hace la diferencia",
      mensaje: "Como donador, puedes programar citas, ver tu historial y ayudar a más personas."
    },
    admin: {
      titulo: `Bienvenido al panel de control, ${nombreUsuario}`,
      subtitulo: "Gestión del banco de sangre",
      mensaje: "Desde aquí puedes administrar donadores, citas y reportes del sistema."
    },
    // si es un rol diferente a admin o donador
    default: {
      titulo: `¡Bienvenido/a, ${nombreUsuario}!`,
      subtitulo: `Tu rol es: ${nombreRol}`,
      mensaje: "Gracias por ser parte de nuestro banco de sangre."
    }
  };

  // seleccionar mensaje
  const mensaje = mensajesPorRol[nombreRol.toLowerCase()] || mensajesPorRol.default;

  return (
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-auto my-32 text-center">
        <h1 className="text-2xl font-bold text-teal-700 mb-2 text-center">
          {mensaje.titulo}
        </h1>
        <h2 className="text-xl text-teal-600 mb-4 text-center">
          {mensaje.subtitulo}
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {mensaje.mensaje}
        </p>
        
        {/* iconos de acuerdi al rol */}
        <div className="flex justify-center">
          {nombreRol.toLowerCase() === 'donador' ? (
            <img 
              src="/icono-donador.jpg" 
              alt="Donador" 
              className="h-20 w-20"
            />
          ) : (
            <img 
              src="/icono-admin.png" 
              alt="Administrador" 
              className="h-20 w-20"
            />
          )}
        </div>
      </div>
  );
}
