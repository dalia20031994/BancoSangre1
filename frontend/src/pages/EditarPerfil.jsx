import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { getAuthenticatedUser, getUserById, updateUserData } from '../api/usuarios.api';

const EditarPerfil = () => {
  const { nombreRol } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre_usuario: '',
    correo: '',
    sexo: '',
    password: '',
    password_confirmation: ''
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const authUser = await getAuthenticatedUser(token);
        const userDetails = await getUserById(authUser.id, token);

        setUsuario({
          nombre_usuario: userDetails.nombre_usuario || '',
          correo: userDetails.correo || '',
          sexo: userDetails.sexo || '',
          password: '',
          password_confirmation: ''
        });
        setLoading(false);
      } catch (err) {
        setErrores({ general: ['Error al cargar los datos del usuario'] });
        setLoading(false);
        console.error(err);
      }
    };

    obtenerDatosUsuario();
  }, [token]); // nombreRol is not needed here as the authenticated user's ID is fetched first

  // Validar formulario cada vez que cambien los datos del usuario
  useEffect(() => {
    const validarFormulario = () => {
      const nuevosErrores = {};
      let valido = true;

      // Validar nombre de usuario
      if (!usuario.nombre_usuario.trim()) {
        nuevosErrores.nombre_usuario = ['El nombre de usuario es obligatorio'];
        valido = false;
      } else if (usuario.nombre_usuario.length < 3) {
        nuevosErrores.nombre_usuario = ['Mínimo 3 caracteres'];
        valido = false;
      }

      // Validar correo
      if (!usuario.correo.trim()) {
        nuevosErrores.correo = ['El correo es obligatorio'];
        valido = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)) {
        nuevosErrores.correo = ['Ingrese un correo válido'];
        valido = false;
      }

      // Validar contraseña si se está cambiando
      if (usuario.password || usuario.password_confirmation) {
        if (usuario.password !== usuario.password_confirmation) {
          nuevosErrores.password_confirmation = ['Las contraseñas no coinciden'];
          valido = false;
        }

        if (usuario.password && !validarContrasena(usuario.password)) {
          nuevosErrores.password = [
            'La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una mayúscula y un símbolo especial'
          ];
          valido = false;
        }
      }

      setErrores(nuevosErrores);
      setIsFormValid(Object.keys(nuevosErrores).length === 0); // Form is valid if there are no errors
    };

    validarFormulario();
  }, [usuario]);

  const validarContrasena = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,15}$/;
    return regex.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      const authRes = await getAuthenticatedUser(token);

      const datosActualizacion = {
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        sexo: usuario.sexo,
        ...(usuario.password && { password: usuario.password })
      };

      await updateUserData(authRes.id, datosActualizacion, token, nombreRol === 'donador');

      setModalVisible(true);
    } catch (err) {
      if (err.response?.data) {
        setErrores(err.response.data);
      } else {
        setErrores({ general: ['Error al actualizar el perfil'] });
      }
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigate(`/${nombreRol}/inicio`);
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando datos del perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">


      {/* Formulario */}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Editar Perfil</h2>

        {errores.general && <ErrorMessage message={errores.general[0]} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre de Usuario */}
          <div>
            <label className="block text-sm font-bold text-teal-700">
              Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre_usuario"
              value={usuario.nombre_usuario}
              onChange={handleInputChange}
              className={`w-full h-9 mt-2 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 ${
                errores.nombre_usuario ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Escribe tu nombre de usuario"
            />
            {errores.nombre_usuario && <ErrorMessage message={errores.nombre_usuario[0]} />}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-sm font-bold text-teal-700">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="correo"
              value={usuario.correo}
              onChange={handleInputChange}
              className={`w-full h-9 mt-2 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 ${
                errores.correo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ejemplo@correo.com"
            />
            {errores.correo && <ErrorMessage message={errores.correo[0]} />}
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-bold text-teal-700">
              Sexo
            </label>
            <select
              name="sexo"
              value={usuario.sexo}
              onChange={handleInputChange}
              className={`w-full h-9 mt-2 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 ${
                errores.sexo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errores.sexo && <ErrorMessage message={errores.sexo[0]} />}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-bold text-teal-700">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={usuario.password}
              onChange={handleInputChange}
              className={`w-full h-9 mt-2 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 ${
                errores.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="8-15 caracteres con mayúscula y símbolo"
            />
            {errores.password && <ErrorMessage message={errores.password[0]} />}
            {usuario.password && (
              <p className="text-red-500 text-sm mt-1">
                La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una letra mayúscula y un símbolo especial (@#$%^&+=!?*-)
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-bold text-teal-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={usuario.password_confirmation}
              onChange={handleInputChange}
              className={`w-full h-9 mt-2 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 ${
                errores.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Repite tu contraseña"
            />
            {errores.password_confirmation && <ErrorMessage message={errores.password_confirmation[0]} />}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(`/${nombreRol}/inicio`)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md transition ${
                isFormValid
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center"
          style={{
            backgroundImage: "url(sangre2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-teal-700">¡Perfil Actualizado!</h3>
            <p className="text-gray-700 my-4">Los cambios se han guardado correctamente.</p>
            <button
              onClick={handleModalClose}
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarPerfil;