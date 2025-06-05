/*para el campo de municipio de calle el formato y eso la vista  */
import { CheckCircle } from "lucide-react";

const MunicipioInput = ({ 
  value, 
  onChange, 
  municipioTocado, 
  municipioValido, 
  errores, 
  sugerencias, 
  onSuggestionClick,
  inputRef
}) => {
  return (
    <div className="relative mb-4"> {/* Añade margen inferior y relative */}
      <label className="block text-sm font-bold text-teal-700">
        Municipio <span className="text-red-500">*</span>
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe el municipio"
          ref={inputRef}
        />
        {municipioValido && (
          <CheckCircle
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none"
          />
        )}
      </div>
      {municipioTocado && errores.municipio && (
        <div className="text-red-600 text-sm mt-1">{errores.municipio}</div>
      )}
      {sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {sugerencias.map((municipio, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-teal-50"
              onClick={() => onSuggestionClick(municipio)}
            >
              {municipio.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MunicipioInput;