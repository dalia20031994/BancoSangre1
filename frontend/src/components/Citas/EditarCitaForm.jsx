const EditarCitaForm = ({
  formData,
  handleChange,
  donadores,
  handleSubmit,
  resetForm,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 rounded-xl shadow-lg bg-white border border-gray-200"
    >
      <h3 className="text-xl font-semibold mb-4">Editar Cita</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="fecha" className="block font-medium mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="hora" className="block font-medium mb-1">
            Hora
          </label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="tipo_sangre" className="block font-medium mb-1">
            Tipo de Sangre
          </label>
          <select
            id="tipo_sangre"
            name="tipo_sangre"
            value={formData.tipo_sangre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona un tipo</option>
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

        <div>
          <label htmlFor="id_donador" className="block font-medium mb-1">
            Donador
          </label>
          <select
            id="id_donador"
            name="id_donador"
            value={formData.id_donador}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona un donador</option>
            {donadores.map((donador) => (
              <option key={donador.id} value={donador.id}>
                {donador.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarCitaForm;
