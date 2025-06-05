import { ErrorMessage } from "../../../Errores/ErrorMessage";

const CampoNumero = ({ label, name, required, value, onChange, errores = [], ...props }) => (
  <div>
    <label className="block text-sm font-bold text-teal-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="number"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full h-9 mt-2 px-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-100"
      {...props}
    />
    {errores.map((error, index) => <ErrorMessage key={index} message={error} />)}
  </div>
);

export default CampoNumero;
