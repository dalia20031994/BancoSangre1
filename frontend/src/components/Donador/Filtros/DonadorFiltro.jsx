const FiltroDonadores = ({ filters, loading, handleFilterChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      {/* Tipo Sangre */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Tipo de Sangre</label>
        <select
          name="tipo_sangre"
          value={filters.tipo_sangre}
          onChange={handleFilterChange}
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Sexo */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Sexo</label>
        <select
          name="sexo"
          value={filters.sexo}
          onChange={handleFilterChange}
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>

      {/* Edad Mínima */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Edad Mínima</label>
        <input
          type="number"
          name="edad_min"
          min="18"
          max="100"
          value={filters.edad_min}
          onChange={handleFilterChange}
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="18"
        />
      </div>

      {/* Edad Máxima */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Edad Máxima</label>
        <input
          type="number"
          name="edad_max"
          min="18"
          max="100"
          value={filters.edad_max}
          onChange={handleFilterChange}
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="65"
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Aplicar Filtros'}
        </button>
      </div>
    </form>
  );
};

export default FiltroDonadores;