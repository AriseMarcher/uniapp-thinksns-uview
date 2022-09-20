import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

// 设置文件访问基础地址信息
Vue.prototype.BaseFileUrl = 'http://ts.lagou.uieee.com/api/v2/files/'

import uniNavBar from "@/components/uni-nav-bar/index";
Vue.component("uni-nav-bar", uniNavBar);

import login from "@/components/login/login"
Vue.component("login", login);

// 引入 store 
import store from '@/store/index.js'
Vue.prototype.$store = store

App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

app.$mount()
