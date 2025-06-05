//Permite registra un usuario como donador es decir con el rol 2
import { useState } from "react";
import { ErrorMessage } from "../../components/Errores/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../api/usuarios.api"; 
import logoImg from '../../assets/logo.png';

export default function Registro() {
  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    correo: "",
    sexo: "M",
    password: "",
    confirmPassword: "",
    rol: 2,
  });
  const [errores, setErrores] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const validarPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!?*\-])[A-Za-z\d@#$%^&+=!?*\-]{8,15}$/;
    return regex.test(password);
  };
  const isFieldEnabled = (fieldName) => {
    switch (fieldName) {
      case "correo":
        return usuario.nombre_usuario.length > 0;
      case "sexo":
        return usuario.correo.length > 0;
      case "password":
        return usuario.sexo.length > 0;
      case "confirmPassword":
        return usuario.password.length > 0;
      default:
        return true;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!usuario.nombre_usuario) {
      nuevosErrores.nombre_usuario = ["El nombre de usuario es obligatorio"];
    }
    if (!usuario.correo) {
      nuevosErrores.correo = ["El correo es obligatorio"];
    }
    if (!usuario.sexo) {
      nuevosErrores.sexo = ["El sexo es obligatorio"];
    }
    if (usuario.password) {
      if (!validarPassword(usuario.password)) {
        nuevosErrores.password = [
          "La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una letra mayúscula, una minúscula, un número y un símbolo especial (@#$%^&+=!?* -)",
        ];
      }
      if (usuario.password !== usuario.confirmPassword) {
        nuevosErrores.confirmPassword = ["Las contraseñas no coinciden"];
      }
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    try {
      const res = await registrarUsuario(usuario);
      if (!res.ok) {
        const errorData = await res.json();
        setErrores(errorData);
        return;
      }
      setModalVisible(true);
      setUsuario({
        nombre_usuario: "",
        correo: "",
        sexo: "M",
        password: "",
        confirmPassword: "",
        rol: 2,
      });
      setErrores({});
    } catch (error) {
      console.error("Error al conectar con el servidor", error);
      setErrores({ general: ["Error al conectar con el servidor."] });
    }
  };
  const handleModalClose = () => {
    setModalVisible(false);
    navigate("/Login");
  };
  const isFormValid =
    usuario.nombre_usuario &&
    usuario.correo &&
    usuario.sexo &&
    (usuario.password === usuario.confirmPassword);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src={logoImg} alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700 leading-tight">
              Banco de Sangre
            </h1>
            <p className="text-[16px] text-gray-600 font-bold">Angeles</p>
          </div>
        </div>
      </div>
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md mx-auto mt-8 p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-teal-700">
          Registrar donante
        </h2>
        <label className="block text-sm font-medium text-gray-700">
          <span className="text-red-500">* Campos obligatorios</span>
        </label>
        {errores.general && <ErrorMessage message={errores.general[0]} />}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Nombre corto<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={usuario.nombre_usuario}
            onChange={(e) =>
              setUsuario({ ...usuario, nombre_usuario: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          {errores.nombre_usuario && (
            <ErrorMessage message={errores.nombre_usuario[0]} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-900">
            Correo<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={usuario.correo}
            onChange={(e) =>
              setUsuario({ ...usuario, correo: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={!isFieldEnabled("correo")}
          />
          {errores.correo && <ErrorMessage message={errores.correo[0]} />}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-900">
            Sexo<span className="text-red-500">*</span>
          </label>
          <select
            value={usuario.sexo}
            onChange={(e) => setUsuario({ ...usuario, sexo: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            disabled={!isFieldEnabled("sexo")}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errores.sexo && <ErrorMessage message={errores.sexo[0]} />}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-900">
            Contraseña
            {usuario.sexo && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            value={usuario.password}
            onChange={(e) =>
              setUsuario({
                ...usuario,
                password: e.target.value,
                confirmPassword: "",
              })
            }
            className="w-full border border-gray-300 p-2 rounded"
            disabled={!isFieldEnabled("password")}
          />
          <p className="text-red-500 text-sm mt-1">
            La contraseña debe tener entre 8 y 15 caracterés, incluir al menos
            una letra mayúscula, una minuscula, un número, un símbolo especial
            (@#$%^&+=!?*-)
          </p>
          {errores.password && <ErrorMessage message={errores.password[0]} />}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-900">
            Confirmar Contraseña
            {usuario.password && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            value={usuario.confirmPassword}
            onChange={(e) =>
              setUsuario({ ...usuario, confirmPassword: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
            disabled={!isFieldEnabled("confirmPassword")}
          />
          {errores.confirmPassword && (
            <ErrorMessage message={errores.confirmPassword[0]} />
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className={`${
              isFormValid ? "bg-teal-700" : "bg-gray-400"
            } text-white px-6 py-2 rounded hover:bg-teal-800 transition`}
            disabled={!isFormValid}
          >
            Registrar
          </button>
        </div>
      </form>
      {modalVisible && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center"
          style={{
            backgroundImage: "url(sangre2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-teal-700">¡Registro Exitoso!</h3>
            <p className="text-gray-700 my-4">
              El usuario ha sido registrado correctamente.
            </p>
            <button
              onClick={handleModalClose}
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
            >
              Ingresar
            </button>
          </div>
        </div>
      )}
      <footer className="bg-teal-700 text-white p-4 mt-8 text-center">
        <p>Dirección: 68000, C. de Los Libres 406-a, 68000 Centro, Oax.</p>
        <p>&copy; 2025 Banco de Sangre Ángeles | Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
