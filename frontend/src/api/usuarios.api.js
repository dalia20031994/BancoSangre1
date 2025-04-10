import axios from 'axios'
//para hace consulatas al backend
export const getUsuarios = () => {
   return axios.get('http://127.0.0.1:8000/api/usuarios/')
}