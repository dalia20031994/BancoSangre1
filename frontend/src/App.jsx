import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { TasksFormPage } from './pages/TasksFormPage';
import { Navigation } from './components/Navigation';
import { PaginaPrincipal } from './pages/paginaPrincipal';
import { PaginaLogin } from './pages/PaginaLogin';
function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/Inicio" />} />
        <Route path="/Inicio">
          <Route index element={<PaginaPrincipal />} />
          <Route path="Login" element={<PaginaLogin />} />
        </Route>
        <Route path="/tasks/create" element={<TasksFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;