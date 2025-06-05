import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { PaginaLogin } from '../pages/Inicio/PaginaLogin';
import { PaginaPrincipal } from '../pages/Inicio/PaginaPrincipal';
import { Inicio } from '../pages/Inicio/Inicio';
import CompletarRegistro from '../pages/Formularios/CompletarRegistro';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Registro from "../pages/Inicio/Registro";
import Encabezado from '../components/Layout/Encabezado';
import MapaDonadores from '../pages/Donadores/MapaDonadores';
import EditarPerfil from '../pages/Formularios/EditarPerfil';
import EditarPerfilDonador from '../pages/Formularios/EditarPerfilDonador';
import DonadoresList from '../pages/Donadores/DonadoresList';
import EditarDonador from '../pages/Formularios/EditarDonador';
import CitaProgramada from '../pages/Citas/CitaProgramada';
import HistorialCitas from '../pages/Citas/MisCitas';
import CitasAdmin from '../pages/Citas/HistorialCitas';
import DonacionFAQ from '../pages/SeccionInformativa';
import CitasInteligente from '../pages/Citas/ControladorCitas';
import CrearNotificacionForm from '../pages/CrearNotificaciones';
import ListaNotificacionesActivas from '../pages/ListaNotificacione';
import DonadorNotifications from '../pages/DonadorNotificacion';
import Reportes from '../pages/Reportes';

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
        <Route path="crearNotificacion" element={<CrearNotificacionForm />} />  
        <Route path="NotificacionesActivas" element={<ListaNotificacionesActivas />} />  
        <Route path="MisNotificaciones" element={<DonadorNotifications />} />  
        <Route path="Donaciones" element={<Reportes />} />  
        <Route index element={<Navigate to="inicio" />} />
      </Route>
      {/* para url no registradas regresa al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}