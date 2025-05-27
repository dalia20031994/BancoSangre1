import React, { useState } from "react";
import { ErrorMessage } from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom"; 
export default function Registro() {
  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    correo: "",
    sexo: "M",
    password: "",
    confirmPassword: "", 
    rol: 2
  });
  const [errores, setErrores] = useState({});
  const [modalVisible, setModalVisible] = useState(false); 
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!usuario.nombre_usuario) {
      nuevosErrores.nombre_usuario = ["El nombre de usuario es obligatorio"];
    }
    if (!usuario.correo) {
      nuevosErrores.correo = ["El correo es obligatorio"];
    }
    if (!usuario.password) {
      nuevosErrores.password = ["La contraseña es obligatoria"];
    }
    if (usuario.password !== usuario.confirmPassword) {
      nuevosErrores.confirmPassword = ["Las contraseñas no coinciden"];
    }
    if (!usuario.sexo) {
      nuevosErrores.sexo = ["El sexo es obligatorio"];
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

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
        rol: 3
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
  const isCorreoEnabled = usuario.nombre_usuario.length > 0;
  const isSexoEnabled = usuario.correo.length > 0;
  const isPasswordEnabled = usuario.sexo.length > 0;
  const isConfirmPasswordEnabled = usuario.password.length > 0;
  const isFormValid =
    usuario.nombre_usuario &&
    usuario.correo &&
    usuario.password &&
    usuario.confirmPassword &&
    usuario.password === usuario.confirmPassword &&
    usuario.sexo;
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700 leading-tight">Banco de Sangre</h1>
            <p className="text-[16px] text-gray-600 font-bold">Angeles</p>
          </div>
        </div>
      </div>
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md mx-auto mt-8 p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-teal-700">Registrar donante</h2>
        <label className="block text-sm font-medium text-gray-700">
          <span className="text-red-500">* Campos obligatorios</span>
        </label>
        {errores.general && <ErrorMessage message={errores.general[0]} />}
        {/* Nombre de usuario */}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Nombre corto<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={usuario.nombre_usuario}
            onChange={(e) => setUsuario({ ...usuario, nombre_usuario: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          {errores.nombre_usuario && <ErrorMessage message={errores.nombre_usuario[0]} />}
        </div>
        {/* Correo (habilitado solo si el nombre está lleno) */}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Correo<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={usuario.correo}
            onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={!isCorreoEnabled}
          />
          {errores.correo && <ErrorMessage message={errores.correo[0]} />}
        </div>
        {/* Sexo (habilitado solo si el correo está lleno) */}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Sexo<span className="text-red-500">*</span>
          </label>
          <select
            value={usuario.sexo}
            onChange={(e) => setUsuario({ ...usuario, sexo: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            disabled={!isSexoEnabled}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errores.sexo && <ErrorMessage message={errores.sexo[0]} />}
        </div>
        {/* Contraseña (habilitado solo si el sexo está lleno) */}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Contraseña<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={usuario.password}
            onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={!isPasswordEnabled}
          />
           <p className="text-red-500 text-sm mt-1">La contraseña debe tener entre 8 y 15 caracterés, incluir al menos una letra mayúscula,una minuscula, un número, un símbolo especial (@#$%^&+=!?*-) </p>
          {errores.password && <ErrorMessage message={errores.password[0]} />}
        </div>
        {/* Confirmar Contraseña (habilitado solo si la contraseña está llena) */}
        <div>
          <label className="block text-sm font-medium text-green-900">
            Confirmar Contraseña<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={usuario.confirmPassword}
            onChange={(e) => setUsuario({ ...usuario, confirmPassword: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={!isConfirmPasswordEnabled}
          />
          {errores.confirmPassword && <ErrorMessage message={errores.confirmPassword[0]} />}
        </div>
        {/* Botón */}
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
            <h3 className="text-xl font-bold text-teal-700">¡Registro Exitoso!</h3>
            <p className="text-gray-700 my-4">El usuario ha sido registrado correctamente.</p>
            <button
              onClick={handleModalClose}
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
            >
              Ingresar
            </button>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-teal-700 text-white p-4 mt-8 text-center">
        <p>Dirección: 68000, C. de Los Libres 406-a, 68000 Centro, Oax.</p>
        <p>&copy; 2025 Banco de Sangre Ángeles | Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
