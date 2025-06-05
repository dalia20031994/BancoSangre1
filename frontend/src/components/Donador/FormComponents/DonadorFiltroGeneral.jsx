//para filtrar a los donantes existentes para el admin
export function FiltrosDonadores({ filtros, onChange, onLimpiar }) {
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const estados = ['Activo', 'Inactivo'];
  const sexos = ['Masculino', 'Femenino'];
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-10">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">🔍 Filtrar Donadores</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Sangre</label>
          <select
            name="tipoSangre"
            value={filtros.tipoSangre}
            onChange={onChange}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Todos</option>
            {tiposSangre.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
          <select
            name="estado"
            value={filtros.estado}
            onChange={onChange}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Sexo</label>
          <select
            name="sexo"
            value={filtros.sexo}
            onChange={onChange}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Todos</option>
            {sexos.map(sexo => (
              <option key={sexo} value={sexo}>{sexo}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 text-right">
        <button
          onClick={onLimpiar}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
