import {request} from '@/plugins/request'


//获取tag
export const getTags = () =>{
    return request({
        method:'GET',
        url:'/api/tags'
      })
}