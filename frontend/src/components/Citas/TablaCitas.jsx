import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TablaCitas = ({ citas, editarCita, eliminarCita, donadores }) => {
  const obtenerNombreDonador = (id) => {
    const donador = donadores.find((d) => d.id === id);
    return donador ? donador.nombre : 'Desconocido';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Fecha</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Hora</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Tipo de Sangre</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Donador</th>
            <th className="px-4 py-2 text-center font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {citas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No hay citas para mostrar.
              </td>
            </tr>
          ) : (
            citas.map((cita) => (
              <tr key={cita.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{cita.fecha}</td>
                <td className="px-4 py-3">{cita.hora}</td>
                <td className="px-4 py-3">{cita.tipo_sangre}</td>
                <td className="px-4 py-3">{obtenerNombreDonador(cita.id_donador)}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => editarCita(cita)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Editar cita"
                  >
                    <PencilIcon className="inline h-5 w-5" />
                  </button>
                  <button
                    onClick={() => eliminarCita(cita.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar cita"
                  >
                    <TrashIcon className="inline h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCitas;
