import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { PaginaLogin } from '../pages/PaginaLogin';
import { PaginaPrincipal } from '../pages/PaginaPrincipal';
import { Inicio } from '../pages/Inicio';
import CompletarRegistro from '../pages/CompletarRegistro';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Registro from "../pages/Registro";
import Encabezado from '../components/Layout/Encabezado';
import MapaDonadores from '../pages/MapaDonadores';
import EditarPerfil from '../pages/EditarPerfil';
import EditarPerfilDonador from '../pages/EditarPerfilDonador';
import DonadoresList from '../pages/Donadores';
import EditarDonador from '../pages/EditarDonador';
import Citas from '../pages/Citas';
import CitaProgramada from '../pages/CitaProgramada';
import HistorialCitas from '../pages/MisCitas';
import CitasAdmin from '../pages/HistorialCitas';
import DonacionFAQ from '../pages/SeccionInformativa';
import CitasInteligente from '../pages/ControladorCitas';
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
        <Route path="Mapa-Donadores" element={<MapaDonadores />} />
        <Route path="Donadores" element={<DonadoresList />} />
        <Route path="Historial-Citas" element={<HistorialCitas />} />
        <Route path="citas" element={<CitasInteligente />} />
        <Route path="SeccionPreguntas" element={<DonacionFAQ />} />
        <Route path="Cita-Programada" element={<CitaProgramada />} />
        <Route path="donadores/editar/:id" element={<EditarDonador />} />
        <Route path="Citas-Donadores" element={<CitasAdmin />} />
        <Route path="editar-perfil-donador" element={<EditarPerfilDonador />} />  
        <Route path="editar-perfil-usuario" element={<EditarPerfil />} />  
        <Route index element={<Navigate to="inicio" />} />
      </Route>
      {/* para url no registradas regresa al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}