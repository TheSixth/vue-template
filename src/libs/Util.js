import axios from 'axios'
import router from '@/router/index'
import store from '@/store/index'
import config from '@/config/index'
// import * as types from '@/store/mutation-types'

let util = {

}

util.title = (title) => {
  title = title || ''
  window.document.title = title
}

//  创建axiox 实例
util.http = axios.create({
  baseURL: config.api,
  timeout: 30000
})

// http request 拦截器
util.http.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `token ${store.getters.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
util.http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT)
          router.replace({
            path: 'authorize',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    // console : Error: Request failed with status code 402
    console.log(error)
    return Promise.reject(error.response.data)
  })

export default util
