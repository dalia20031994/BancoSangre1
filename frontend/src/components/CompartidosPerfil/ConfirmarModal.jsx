//para el dialogo de confirmacion de la edicion del perfil
import React from 'react';

const ConfirmarModal = ({ message, onConfirm, onCancel, title, isProcessing }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-green-600"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmarModal;