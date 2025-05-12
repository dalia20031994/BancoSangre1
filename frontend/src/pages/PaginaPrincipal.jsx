import { useNavigate } from 'react-router-dom'; 
export function PaginaPrincipal() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* barra de navegación para iniciar sesión  */}
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <div className="text-center">
            <h1 className="text-lg font-bold text-teal-700 leading-tight ">Banco de Sangre</h1>
            <p className="text-[16px]  text-gray-600 font-bold">Angeles</p>
           </div>
        </div>
        <button onClick={() => navigate('/Login')} className="rounded-full px-6 py-2 text-sm bg-teal-700 text-white hover:bg-teal-800">
          Ingresar
        </button>
      </div>

      {/* contenido principal */}
      <div className="relative">
        <img src="/doctor.png"
  alt="Doctor"
  className="w-full h-[calc(100vh-96px)] object-cover brightness-75" />

        <div className="absolute top-1/4 left-8 max-w-md">
          <div className="relative pt-10"> 

            <h2 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-full shadow text-lg font-bold text-gray-800 whitespace-nowrap z-10">
              Bienvenido al Banco de Sangre Angeles
            </h2>

            <div className="bg-cyan-100 p-4 text-sm font-semibold rounded-lg shadow text-justify">
              En el Banco de Sangre Angeles, nuestra misión es ofrecer servicios de medicina transfusional 
              de excelencia, bajo estrictos estándares nacionales e internacionales de calidad en seguridad 
              sanguínea, con los principios del trabajo ético y de responsabilidad social, para el beneficio 
              y satisfacción de nuestros usuarios y la seguridad de nuestros pacientes, siempre bajo un proceso 
              de mejora continua y apegados a marcos normativos.
            </div>
          </div>
        </div>
      </div>
      <div className="bg-teal-700 text-white p-2 text-center text-sm">
        Dirección: 68000, C. de Los Libres 406-a, 68000 Centro, Oax.
      </div>
    </div>
  );
}
