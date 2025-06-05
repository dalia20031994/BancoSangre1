import { ErrorMessage } from "../../../Errores/ErrorMessage";

const CampoSelect = ({ label, name, required, options, value, onChange, errores = [], ...props }) => (
  <div>
    <label className="block text-sm font-bold text-teal-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
      {...props}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt || "Selecciona una opción"}</option>
      ))}
    </select>
    {errores.map((error, index) => <ErrorMessage key={index} message={error} />)}
  </div>
);

export default CampoSelect;
