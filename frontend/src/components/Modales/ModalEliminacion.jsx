import { AlertTriangle } from 'lucide-react';

export function ModalConfirmacion({ visible, onConfirmar, onCancelar }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={28} />
          <h3 className="text-xl font-semibold text-gray-800">¿Eliminar donador?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
