import axios, { AxiosInstance } from 'axios';

const base_url: string = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8080/' : 'http://35.205.121.131:8080/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: base_url,
  responseType: 'json'
});

export default axiosInstance;
