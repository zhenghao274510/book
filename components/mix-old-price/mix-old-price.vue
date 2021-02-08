<template>
	<view class="mix-price-view">
		<text :style="{fontSize: size + 'rpx'}" v-if="type=='detail'">原价</text>
		<text :style="{fontSize: size + 'rpx'}">￥</text>
		<text class="price" :style="{fontSize: size + 'rpx'}">{{ priceArr[0] }}</text>
		<text :style="{fontSize: size + 'rpx'}">.{{ priceArr[1] }}</text>
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
				default: 24
			},
			type:{
				type: String,
				default:'detail'
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
		color:#CCCCCC;
		text-decoration: line-through;
		margin-left: 10rpx;
	}
	.price{
		font-weight: 700;
	}
</style>
