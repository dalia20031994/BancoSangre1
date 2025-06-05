// Componente para mostrar mensajes (éxito, error, info).
import React from 'react';
const MensajeExito = ({ message }) => {
  if (!message || !message.texto) return null;
  const typeClasses = {
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
  };
  return (
    <div className={`p-4 rounded ${typeClasses[message.tipo] || 'bg-gray-100 text-gray-800'}`}>
      {message.texto}
    </div>
  );
};
export default MensajeExito;