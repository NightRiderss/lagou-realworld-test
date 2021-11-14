/**
 * 基于axios封装
 */
import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})
export default ({
    store
}) => {
    //请求拦截器
    request.interceptors.request.use(function (config) {
        const {
            user
        } = store.state
        if (user && user.token) {
            config.headers.Authorization = `Token ${store.state.user.token}`
        }
        return config
    }, function (error) {
        return Promise.reject(error)
    })
    //响应拦截器
}