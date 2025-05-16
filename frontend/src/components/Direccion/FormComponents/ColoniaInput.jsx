/*para el campo de colonia de calle el formato y eso la vista  */
import { CheckCircle } from "lucide-react";

const ColoniaInput = ({ value, onChange, disabled, isValid }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-teal-700">
        Colonia <span className="text-red-500" title="Campo requerido">*</span>
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          disabled={disabled}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Colonia"
        />
        {isValid && (
          <CheckCircle
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};

export default ColoniaInput;