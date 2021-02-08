<template>
	<web-view :src="src"></web-view>
</template>

<script>
	const bassUrl=require("@/common/js/config.js").bass;
	export default{
		data(){
			return{}
		},
		computed:{
			src(){
				return bassUrl+'/daishengniao/display/agreement?id=1'
			}
		}
	}
</script>

<style>
</style>
