<template>
	<view>
		<view class="icon">
			<image src="/static/img/chenggong@2x.png"></image>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="back">
			<view class="btn" hover-class="hover-opacity" @tap="download">下载APP查看订单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			download() {
				uni.reLaunch({
					url:'/pages/login/download'
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.icon {
		width: 100%;
		margin-top: 10vw;

		image {
			width: 335upx;
			height:307upx;
		}
	}

	.tis {
		width: 100%;
		margin-top: 20upx;
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
	}

	.pay-amount {
		width: 100%;
		margin-top: 10upx;
		font-size: 32upx;
	}

	.back {
		width: 100%;
		margin-top: 80upx;

		.btn {
			width: 500upx;
			height: 70upx;
			margin:60upx auto 0;
			background-color:#ff007f;
			color: #FFFFFF;
			align-items: center;
			border-radius:36upx;
			font-size: 26upx;
		}
	}
</style>
