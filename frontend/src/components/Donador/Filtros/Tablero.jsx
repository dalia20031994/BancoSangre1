import { Pencil, Trash2, ToggleRight, ToggleLeft } from 'lucide-react';

export function DonadorItem({ donador, usuarios, onEditar, onEliminar, onToggleEstado }) {
  const mapSexo = {
    'F': 'Femenino',
    'M': 'Masculino'
  };
  const usuarioRelacionado = usuarios.find(u => u.id === donador.usuario);
  const sexoMostrar = usuarioRelacionado
    ? mapSexo[usuarioRelacionado.sexo?.toUpperCase()] || 'No especificado'
    : 'No disponible';
  console.log('Donador recibido:', donador);
  console.log('Usuario relacionado:', usuarioRelacionado);

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">
          {donador.nombre} {donador.apellidoP} {donador.apellidoM}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          Edad: {donador.edad} | Tipo de sangre: {donador.tipoSangre} | Sexo: {sexoMostrar} | Estado: {donador.estado ? 'Activo' : 'Inactivo'}
        </p>
      </div>

      <div className="flex gap-4 mt-2 md:mt-0 items-center">
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded transition"
          onClick={() => onEditar(donador.id)}
        >
          <Pencil size={18} /> Editar
        </button>

        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded transition"
          onClick={() => onEliminar(donador.id)}
        >
          <Trash2 size={18} /> Eliminar
        </button>

        <button
          onClick={() => onToggleEstado(donador.id, donador.estado)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded border
            ${donador.estado ? 'bg-green-100 border-green-600 text-green-700' : 'bg-gray-100 border-gray-400 text-gray-500'}
            hover:bg-opacity-80 transition`}
          title={donador.estado ? 'Marcar como Inactivo' : 'Marcar como Activo'}
        >
          {donador.estado ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          {donador.estado ? 'Activo' : 'Inactivo'}
        </button>
      </div>
    </div>
  );
}
