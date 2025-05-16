import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { PaginaLogin } from '../pages/PaginaLogin';
import { PaginaPrincipal } from '../pages/PaginaPrincipal';
import { Inicio } from '../pages/Inicio';
import CompletarRegistro from '../pages/CompletarRegistro';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Registro from "../pages/Registro";
import Encabezado from '../components/Layout/Encabezado';
import { Donadores } from '../pages/Donadores';
import { Citas } from '../pages/Citas';
import EditarPerfil from '../pages/EditarPerfil';
import EditarPerfilDonador from '../pages/EditarPerfilDonador';

export function Rutas() {
  const { token } = useContext(AuthContext);
  return (   
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<PaginaPrincipal />} />
      {/* Ruta de login */}
      <Route path="/login" element={<PaginaLogin />} /> 
      <Route path="/registro" element={<Registro />} />
      {/* Ruta protegida con nombre de usuario */}
      <Route path="/:nombreRol/CompletarRegistro" element={token ? <CompletarRegistro /> : <Navigate to="/login" />} />
      <Route path="/:nombreRol" element={token ? <Encabezado /> : <Navigate to="/login" />}>
        {/* Sub-rutas del menu*/}
        <Route path="inicio" element={<Inicio />} />
        <Route path="donador" element={<Donadores />} />
        <Route path="citas" element={<Citas />} />      
        <Route path="editar-perfil-donador" element={<EditarPerfilDonador />} />  
        <Route path="editar-perfil-usuario" element={<EditarPerfil />} />  
        <Route index element={<Navigate to="inicio" />} />
      </Route>
      {/* para url no registradas regresa al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}