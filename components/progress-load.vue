<template>
	<view class="progress_con" v-if="isTimeout">
		<progress percent="100" active stroke-width="3" activeColor='#009100' border-radius='50' backgroundColor="#E4E4E4" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTimeout: true
			}
		},
		created() {
			// setTimeout(() => {
			// 	this.isTimeout=false;
			// },600)
		}
	}
</script>

<style>
	.progress_con {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
	}
</style>
