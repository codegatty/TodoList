import axios from 'axios';

export default axios.create({
  baseURL:'http://localhost:8888',
  headers:{"ngrok-skip-browser-warning":"true"}  
   
})