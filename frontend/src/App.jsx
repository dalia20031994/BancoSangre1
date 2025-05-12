import { Rutas } from './router/Rutas';
import { AuthProvider } from './auth/AuthContext';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider>
      <Rutas />
    </AuthProvider>
  );
}

export default App;
