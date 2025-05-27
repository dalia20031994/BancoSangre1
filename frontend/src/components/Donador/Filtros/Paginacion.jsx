import { useState } from 'react';
import { DonadorItem } from './Tablero';

export function ListaDonadoresPaginada({ donadores, usuarios, onEditar, onEliminar, onToggleEstado }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const totalPaginas = Math.ceil(donadores.length / elementosPorPagina);

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const donadoresPagina = donadores.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="space-y-4">
      {donadoresPagina.map((donador) => (
        <DonadorItem
          key={donador.id}
          donador={donador}
          usuarios={usuarios}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onToggleEstado={onToggleEstado}
        />
      ))}

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => cambiarPagina(i + 1)}
            className={`px-3 py-1 border rounded ${paginaActual === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
