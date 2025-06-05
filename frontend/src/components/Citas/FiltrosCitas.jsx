const FiltrosCitas = ({
  filtroFecha,
  setFiltroFecha,
  filtroTipoSangre,
  setFiltroTipoSangre,
  setCurrentPage,
}) => {
  const handleFechaChange = (e) => {
    setFiltroFecha(e.target.value);
    setCurrentPage(1);
  };

  const handleTipoSangreChange = (e) => {
    setFiltroTipoSangre(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mb-8 p-4 rounded-xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Filtros de Citas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className="block font-medium mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={filtroFecha}
            onChange={handleFechaChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="tipoSangre" className="block font-medium mb-1">
            Tipo de Sangre
          </label>
          <select
            id="tipoSangre"
            name="tipo_sangre"
            value={filtroTipoSangre}
            onChange={handleTipoSangreChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosCitas;
