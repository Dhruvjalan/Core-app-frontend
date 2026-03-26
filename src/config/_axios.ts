import Axios from "axios";

const axios = Axios.create({
	baseURL: (import.meta.env.VITE_PRODUCTION === 'true') ? import.meta.env.VITE_PROD_BACKEND_URL : import.meta.env.VITE_DEV_BACKEND_URL,
	withCredentials: true,
});


export default axios;