import { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  /* Mantener al usuario logueado aunque se recarge la página */
  const [token, setToken] = useState(localStorage.getItem('token'));
  /*Guarda el token en localStorage se usa en el inicio de sesion*/
  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };
  /*borra el token del localStorage*/
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
