<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default {
		props: {
			url: {
				type: String
			}
		},
		onLoad(options) {
			console.log(options)
			this.url = decodeURI((options.url))
			console.log(this.url)
		}
	}
</script>

<style lang="scss">

</style>
