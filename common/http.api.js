const install = (Vue, vm) => {
	let api = {}
	// 此处没有使用传入的params参数
	api.getAdvert = () => vm.$u.get('/advertisingspace/advertising?space=1,2,3')
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = api
}

export default {
	install
}
