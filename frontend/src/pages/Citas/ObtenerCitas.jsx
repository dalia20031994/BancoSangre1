//para cuando el dopnador aun no pueda donar por el tiempo entre donaciones
import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { AuthContext } from '../../auth/AuthContext';
import { getAuthenticatedUser } from '../../api/usuarios.api';
import { fetchDonadorByUserId } from '../../api/donador.api';
const CitaInadecuada = () => {
  const { token } = useContext(AuthContext);
  const [donador, setDonador] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultimaDonacionFecha, setUltimaDonacionFecha] = useState(null);
  const [fechaProximaDonacion, setFechaProximaDonacion] = useState(null);
  useEffect(() => {
    moment.locale('es');
    if (!token) {
      setError('No autorizado');
      setLoading(false);
      return;
    }
    const cargarDatos = async () => {
      try {
        const usuarioData = await getAuthenticatedUser(token);
        setUsuario(usuarioData);
        const donadorData = await fetchDonadorByUserId(usuarioData.id, token);
        setDonador(donadorData);
        if (donadorData.ultimaDonacion) {
          const ultimaDonacionMoment = moment(donadorData.ultimaDonacion);
          setUltimaDonacionFecha(ultimaDonacionMoment.format('DD [de] MMMM [de] YYYY'));

          const mesesEspera = usuarioData.sexo === 'F' ? 3 : 2;
          const proximaDonacionMoment = ultimaDonacionMoment.clone().add(mesesEspera, 'months');
          setFechaProximaDonacion(proximaDonacionMoment.format('DD [de] MMMM [de] YYYY'));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos.');
        setLoading(false);
      }
    };
    cargarDatos();
  }, [token]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-medium text-green-700 animate-pulse">Cargando...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-red-600">❌ {error}</div>
      </div>
    );
  }
  if (!donador) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-xl font-semibold text-red-600">❌ No se encontró el donador.</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-3xl shadow-lg p-10 text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-6">
            ¡Gracias por tu generosidad, {donador.nombre}!
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            🌟 <strong className="text-green-700">Tu decisión de donar sangre no es solo un acto médico... ¡es un acto de amor!</strong><br />
            Cada vez que extiendes tu brazo, estás dándole esperanza a alguien que lucha por su vida. 💚
          </p>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Eres parte de una red de héroes silenciosos que cambian el mundo gota a gota. Tu generosidad deja huellas invisibles, pero imborrables. 🙌🩸
          </p>

          {ultimaDonacionFecha ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left mb-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Historial de Donación
              </h3>
              <p className="text-gray-700 mb-2 text-lg">
                Tu última donación fue el <strong className="text-green-700">{ultimaDonacionFecha}</strong>. ¡Gracias por tu valiosa ayuda!
              </p>
              <p className="text-gray-700 mb-4 text-lg">
                Por tu bienestar, espera <strong className="text-green-700">{usuario?.sexo === 'F' ? '3 meses' : '2 meses'}</strong> entre donaciones.
              </p>
              {fechaProximaDonacion && (
                <p className="text-green-700 font-bold text-lg">
                  🌱 ¡Podrás volver a donar a partir del <span className="underline">{fechaProximaDonacion}</span>! <br />
                  El mundo siempre necesita corazones como el tuyo.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
              <p className="text-xl font-semibold text-yellow-700 mb-3">
                🌟 ¡Aún no tienes donaciones registradas!
              </p>
              <p className="text-gray-700 text-lg">
                Pero cada héroe tiene un comienzo. Da el primer paso y conviértete en parte de algo más grande: <br />
                <strong className="text-yellow-700">una comunidad que salva vidas.</strong> 💖 <br />
                Agenda tu primera cita. ¡Hoy puede ser el día en que cambies una vida para siempre!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitaInadecuada;
