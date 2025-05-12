/*actualmente no funcional no agregar al reporte */
import { useParams, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

export function Citas() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-teal-700 mb-4">
          Bienvenido, {nombreUsuario}
        </h1>
        <p className="text-gray-600">Tu rol es: <strong>{nombreRol}</strong></p>
      </div>
    </div>
  );
}
