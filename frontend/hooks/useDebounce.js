import { useEffect } from "react";

function useDebounce(callback, delay, deps = []) {
  useEffect(() => {
    const handler = setTimeout(() => callback(), delay);
    return () => clearTimeout(handler);  // Limpiamos la espera en el siguiente renderizado
  }, [...deps, delay]);
}

export default useDebounce;
