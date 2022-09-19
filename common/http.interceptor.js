// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token变量
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		// #ifdef H5
			baseUrl: '/api', // 请求的本域名
		// #endif
		
		// #ifndef H5
			baseUrl: 'http://ts.lagou.uieee.com/api/v2', // 拉勾服务器
			// baseUrl: 'http://47.115.83.135/api/v2', // 教学服务器
		// #endif
		// 设置为json，返回后会对数据进行一次JSON.parse()
		dataType: "json",
		showLoading: true, // 是否显示请求中的loading
		loadingText: "请求中...", // 请求loading中的文字提示
		loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: true, // 是否在拦截器中返回服务端的原始数据
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 配置请求头信息
		header: {
			"content-type": "application/json;charset=UTF-8",
		},
	});
		
	
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		return config;
	}
	
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log(res)
		return res
	}
}

export default {
	install
}