import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

export default function VerContrase({ onToggle }) {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    const newVisibility = !visible;
    setVisible(newVisibility);
    onToggle(newVisibility);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      {visible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}