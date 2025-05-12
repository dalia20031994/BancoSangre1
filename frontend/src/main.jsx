import React from 'react';
/* Para renderizar en el navegador  */
import ReactDOM from 'react-dom/client';
/* importar el componente principal */
import App from './App';
/* en ese archivo esta el estilo de tailwis */
import './index.css'; 
/* permite habilitar la navegación por rutas */
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);