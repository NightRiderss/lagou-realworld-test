//
const cookieParser = process.server ? require('cookieparser') : undefined
export const state = () => {
    return {
        user:'null'
    }
}

export const mutations = {
    setUser(state,data){
        state.user = data
    }
}

export const actions = {
    // nuxt特有方法 只在服务端渲染期间运行
    nuxtServerInit({commit},{req}){
        let user = null
        if(req.headers.cookie){
            const parsed = cookieParser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)
            } catch (error) {
                
            }
        }

        commit('setUser',user)
    }
}