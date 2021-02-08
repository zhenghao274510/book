<template>
	<view class="mix-price-view" :style="{color:fontColor}">
		<text style="font-size: 21rpx;">￥</text>
		<text class="price" :style="{fontSize: size + 'rpx',color:fontColor}">{{ priceArr[0] }}</text>
		<text style="font-size: 26rpx;">.{{ priceArr[1] }}</text>
	</view>
</template>

<script>
	/**
	 * 价格显示组件
	 */
	export default {
		data() {
			return {
				priceArr: []
			};
		},
		props: {
			price: {
				type:[String,Number],
				default: 0
			},
			size: {
				type: Number,
				default: 32
			},
			fontColor:{
				type:String,
				default:'#FF3E18'
			}
		},
		watch: {
			price(){
				this.render();
			}
		},
		created() {
			this.render();
		},
		methods: {
			render(){
				const price = parseFloat(this.price).toFixed(2);
				this.priceArr = (''+price).split('.');
			}
		}
	}
</script>

<style scoped lang="scss">
	.mix-price-view{
		color:#FF3E18;
	}
	.price{
		font-weight: 700;
		color:#FF3E18;
	}
</style>
