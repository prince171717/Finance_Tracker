import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL:"http://localhost:1717",
    withCredentials:true
})