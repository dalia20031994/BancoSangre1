import axios from 'axios';
/*Permite generar al token al mandarle el correo y contraseña de un usuario registrado*/ 
export const loginRequest = (correo, password) => {
   return axios.post('http://localhost:8000/api/token/', {
     correo,
     password,
   }, {
     headers: {
       'Content-Type': 'application/json',
     },
   });
 };
 