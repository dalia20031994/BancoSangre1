/*para el campo de texto de numero el formato y eso la vista  */
import { CheckCircle } from "lucide-react";
const NumeroInput = ({ 
  label, 
  value, 
  onChange, 
  disabled, 
  isValid, 
  error, 
  errorMessage, 
  placeholder, 
  required 
}) => {
  return (
    <div>
      <label className="block text-sm font-bold text-teal-700">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          disabled={disabled}
          className={`
            w-full border-gray-300 rounded-lg shadow-sm
            focus:ring focus:ring-teal-500 focus:ring-opacity-50
            pr-10
            ${error ? 'border-red-500' : ''}
          `}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {isValid && (
          <CheckCircle
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none"
          />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default NumeroInput;