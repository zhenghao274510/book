<template>
	<view class="row center" style="width: 750rpx;">
		<scroll-view class="scroll-h" scroll-x="true"  :scroll-into-view="scrollInto">
			<view v-for="(tab, index) in tabs" :key="tab.threeTypeId" class="uni-tab-item" :id="'a'+tab.threeTypeId" :data-current="index" @click="ontabtap(index)"
			 :class="tabIndex == index ? 'uni-tab-item-active' : ''">
				<text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''">{{ tab.threeTypeName}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		props:{
			tabs: { // 支持格式: ['全部', '待付款'] 或 [{name:'全部'}, {name:'待付款'}]
				type: Array,
				default () {
					return []
				}
			},
			tabIndex:{
				type: [Number,String],
				default:0
			}
		},
		computed:{
			scrollInto(){
				let n=this.tabIndex;
				return 'a'+this.tabs[n].threeTypeId
			}
		},
		methods:{
			ontabtap(ind){
				this.$emit('change',ind)
			}
		}
		
	}
</script>

<style scoped lang="less">
	.scroll-h {
		width: 750rpx;
		line-height:60rpx;
		white-space: nowrap;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		box-sizing: border-box;
	}
	.uni-tab-item {
		display: inline-block;
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding:0  40rpx;
		display: inline-block;
		
	}
	
	.uni-tab-itembor {
		width: 32rpx;
		height: 4rpx;
		background-color: rgba(0, 0, 0, 0);
		border-radius: 2rpx;
		margin: 0 auto;
	}
	
	.uni-tab-item-active {}
	
	.uni-tab-item-activebor {
		background-color: #ffffff;
	}
	
	.uni-tab-item-title {
		color: #333333;
		font-size: 30rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		border-radius: 25rpx;
		font-size: 24rpx;
		padding:10rpx;
	}
	
	.uni-tab-item-title-active {
		color: #333333;
		font-size: 26rpx;
		font-weight: bold;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 37rpx;
			height: 4rpx;
			background: linear-gradient(#FF4C83,#FF3E18);
			// background: #FF4C83;
			border-radius: 2rpx;
		}
	}
</style>
