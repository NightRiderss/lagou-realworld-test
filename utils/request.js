/**
 * 基于axios封装
 */
import axios from 'axios'

const request = axios.create({
    baseURL:'https://conduit.productionready.io'
})

//请求拦截器
request.interceptors.request.use(function (config){
    config.headers.Authorization = `Token `
    return config
},function(error){
    return Promise.reject(error)
})
//响应拦截器

export default request