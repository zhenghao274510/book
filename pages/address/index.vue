<template>
	<view class="app">
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData" :back-top="true">
			<view class="main-wrap">
				<view class="item row between" v-for="(item, index) in dataList" :key="index" @tap.stop="chooseAddress(item)">
					<view class="fill">
						<view class="content">{{ item.address }} {{ item.addressdetail}}</view>
						<view class="row" style="padding-bottom: 10rpx;">
                             <view class="reg-con" v-if="item.isdefault==1">
                             	默认地址
                             </view>
							<view class="name">{{ item.phone }}</view>
							<view class="name">{{ item.name }}</view>
						</view>
					</view>
					<view class="bot row" @tap.stop.prevent="stopPrevent">
						<view class="btn center" style="margin-right: 16rpx;" @tap="editAddr(item)">
							<image src="/static/img/bianji.png" class="bian_icon"></image>
						</view>
						<view class="btn center" @tap="showDelModal(item.addressid)">
							<text class="mix-icon icon-lajitong" style="color: #333333;"></text>
						</view>
					</view>
				</view>
			</view>
		</s-pull-scroll>
		<view class="bot-btn-wrap fix-bot">
			<mix-button text="添加新地址" icon="icon-jia2" :iconSize="36" :isConfirm="false" @onConfirm="navTo(`./addaddress`)"></mix-button>
		</view>
		<mix-loading v-if="isLoading" :mask='true'></mix-loading>

		<mix-modal ref="mixModal" title="提示" text="确定要删除该地址吗" @onConfirm="deleteAddr"></mix-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isChoose:'',
				addressid:'',
				choosedId:'',
				dataList: []
			}
		},
		onLoad(options) {
         this.isChoose=options.choose;
		 this.choosedId=options.id;
		},
		onShow() {
			this.refresh();
		},
		methods: {
			refresh() {
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			pullDown(pullScroll) {
				setTimeout(() => {
					this.loadData(pullScroll);
				}, 200)
			},
			async updateDefaultAddress(addressid){
				const e={
					uid:uni.getStorageSync('uid'),
					addressid
				}
				const res=await this.$request('myAddressList',e);
				this.$util.msg(res.resultNote);
				if(res.result==0){
					this.refresh()
				}
			},
			async loadData(pullScroll) {
				let parmas = {
					uid: uni.getStorageSync('uid')
				}
				const res = await this.$request('myAddressList', parmas);
				if (res.result != 0) {
					this.$util.msg(res.resultNote);
					return
				}
				res.dataList.length == 0 ? pullScroll.empty():(this.dataList =res.dataList,pullScroll.finish())
			},
			//选择地址
			chooseAddress(item) {
				if (!this.isChoose) {
					return;
				}
				this.$util.prePage().setAddress(item);
				uni.navigateBack();
			},
			/**
			 * 删除地址
			 * 注意 删除成功已选择的地址需要清空
			 */
			async deleteAddr() {
				const parmas={
					uid:uni.getStorageSync('uid'),
					addressid:this.addressid
				}
				const res = await this.$request('deleteAddress',parmas,{showLoading: true});
				this.$util.msg(res.resultNote);
				if (res.result ==0) {
					this.refresh();
					if(this.choosedId==this.addressid){
						this.$util.prePage().setAddress({});
					}
				}
			},
			//编辑地址
			editAddr(item) {
				this.navTo(`./change?data=${JSON.stringify(item)}`);
			},
			showDelModal(id) {
				this.addressid = id;
				this.$refs.mixModal.open();
			}
		}
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style scoped lang="scss">
	.reg-con {
		width: 110upx;
		line-height: 46upx;
		background: #999999;
		text-align: center;
		border-radius: 4upx;
		margin-right: 20rpx;
		font-size: 22upx;
		color: #FFFFFF;
	}
	.bian_icon{
		width: 36rpx;
		height: 36rpx;
	}
	.app {
		padding-top: 20rpx;
	}
	.item {
		padding: 20rpx;
		margin: 0 20rpx 20rpx;
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, .03);
		height: 169rpx;
		.name {
			margin-right:20rpx;
			font-size:24rpx;
			color:#666666;
		}
		.mobile {
			margin-right: 32rpx;
			font-size: 28rpx;
			color: #999;
		}

		.tag {
			padding: 0 8rpx;
			font-size: 20rpx;
			color: #fff;
			line-height: 28rpx;
			background-color: $base-color;
			border-radius: 2rpx;
		}

		.content {
			font-size: 30rpx;
			color: #333333;
			padding-bottom: 10rpx;
		}

		.bot {
			justify-content: flex-end;
			height: 79rpx;

			&:before {
				left: -26rpx;
				right: -26rpx;
				border-color: #f0f0f0;
			}
		}

		.btn {
			font-size: 26rpx;
			color: #444;

			.mix-icon {
				margin-right: 16rpx;
				font-size: 34rpx;
			}
		}
	}

	.bot-btn-wrap {
		position: fixed;
		left:50%;
		transform: translateX(-50%);
		bottom: 30rpx;
		z-index: 90;
		width: 100%;
	}
</style>
