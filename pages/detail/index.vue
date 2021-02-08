<template>
	<view class="app">
		<view class="main-wrap" :class="{show: loaded}" style="padding-bottom: 100rpx;">
			<!-- 轮播图 -->
			<mix-swiper :list="dataobject.images"></mix-swiper>
			<!-- "iscoll":""//是否收藏 0未收藏 1已收藏
				       "aid":""//作者id
				       "aname":""//作者名称
				       "abirthday":""//作者出生日期
				       "aimage":""//作者头像
				       "aschool":""//作者毕业院校 -->

			<view class="introduce column">
				<view class="" style="overflow: hidden;width: 100%;">
					<text class="title">{{dataobject.name}}</text>
					<view class="vip_lev_con">

					</view>
				</view>
				<view class="price-wrap" style="padding:20rpx 0;">
					<view class="row">
						<mix-price-view :price="dataobject.newprice" :size="54"></mix-price-view>
						<view class="" style="margin-left: 20rpx;">
							<mix-old-price :price="dataobject.oldprice"></mix-old-price>
						</view>

					</view>
				</view>
				<view class="price-wrap row between">
					<view class="m-n-price">销量:{{dataobject.salenum}}</view>
					<view class="m-n-price">库存:{{dataobject.skunum}}</view>

				</view>
			</view>
			<view class="uni-flex row between num-con" @click="showPopup('mixmodal')">
				<view class="">
					商品评价
				</view>
				<view class="row center">
					<view class="" style="font-size: 24rpx;color: #999999;">
						{{dataobject.commnum}}
					</view>
					<view class="mix-icon icon-you"></view>
				</view>
			</view>
			<view class="detail-desc">
				<view class="d-header center">
					<text>商品详情</text>
				</view>
				<jyf-parser ref="article" :html="content" lazy-load show-with-animation></jyf-parser>
			</view>
			<view class="">
				<view class="" style="padding:50rpx 0;">
					<image src="/static/img/hot_bg.png" class="hot_bg"></image>
				</view>
				<view class="item_column" @click.stop="showPopup('mixmodal')">
					<view class="column_img_con">
						<image :src="dataobject.aimage" mode="aspectFill" lazy-load="true"></image>
					</view>
					<view class="fill" style="position: relative;height: 160rpx;">
						<view class="uni-second-title" style="font-weight: bold;">{{dataobject.aname}}
						</view>
						<view class="sku-name" style="padding:10rpx 0;">
							出生年月：{{dataobject.abirthday}}
						</view>
						<view class="sku-name">
							毕业院校：{{dataobject.aschool}}
						</view>

					</view>
				</view>
			</view>
			<view class="">
				<view class="" style="padding:50rpx 0;">
					<image src="/static/img/hot_bg.png" class="hot_bg"></image>
				</view>
				<goods-list :list='dataList' totype='detail' @click="changeDetails"></goods-list>
			</view>
			<!-- 底部操作菜单 -->
			<bottom-operation :collect="dataobject.iscoll" :skunum="dataobject.skunum" @click="itemOnClick" @buttonClick="buttonClick"></bottom-operation>
		</view>
		<!-- loading -->
		<mix-loading v-if="isLoading" :mask="true"></mix-loading>
		<mix-modal title="温馨提示" ref="mixmodal" text="是否前往APP查看更多?" confirmText="立即前往" @onConfirm="onConfirm"></mix-modal>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	import mixSwiper from './components/mix-swiper.vue' //轮播图
	import bottomOperation from './components/bottom-operation.vue' //底部栏
	import goodsList from './components/detail-list.vue'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		components: {
			uniNumberBox,
			goodsList,
			jyfParser,
			mixSwiper,
			bottomOperation
		},
		data() {
			return {
				gid: '',
				content: '',
				addOrBuy: 0,
				num: 1,
				dataList: [], //热门推荐
				dataobject: {}
			}
		},
		onLoad(options) {
			this.gid = options.gid;
			options.invitationcode ? this.invitationcode = options.invitationcode : 0;
			this.loadData();
		},
		methods: {
			onConfirm() {
				this.navTo('/pages/login/download')
			},
			async loadData() {
				let e = {
					uid: uni.getStorageSync('uid'),
					gid: this.gid
				}
				const res = await this.$request('getgoodsdetail', e, {
					showLoading: true
				})
				if(res.result==0){
					this.content = this.$util.fromContent(res.dataobject.content);
					this.dataobject = res.dataobject;
					this.dataList = res.dataList
				}else{
					this.$util.msg(res.resultNote)
				}
				
			},
			changeDetails(id) {
				console.log(id);
				this.gid = id;
				uni.pageScrollTo({
					scrollTop: 0
				})
				this.loadData();
			},
			itemOnClick(e) {
				console.log(e)
				if(!uni.getStorageSync('uid')){
					this.navTo('/pages/login/index');
					return
				}
				if (e.index == 0) {
					this.showPopup('mixmodal')
				} else {
					this.$util.throttle(async () => {
						const e = {
							gid: this.gid,
							uid: uni.getStorageSync('uid')
						}
						const res = await this.$request('addgoodscoll', e, {
							showLoading: true
						});
						this.$util.msg(res.resultNote);
						if (res.result == 0) {
							this.dataobject.iscoll = this.dataobject.iscoll == 0 ? 1 : 0;
						}
					}, 300)
				}
			},
			buttonClick(e) {
				if (e.index == 0) {
					this.showPopup('mixmodal')
				} else {
					if(!uni.getStorageSync('uid')){
						this.navTo('/pages/login/index');
						return
					}
					this.buyNow();
				}
			},
			//立即购买
			buyNow() {
				let buyGoods = [],
					createType = '';
				const data = this.getConfirmData();
				if (!data) {
					return;
				}
				this.$set(buyGoods, 0, data);
				uni.navigateTo({
					url: `/pages/order/creatOrder?goods=${encodeURIComponent(JSON.stringify(buyGoods))}&type=goods`
				})
			},
			getConfirmData() {
				if (this.dataobject.skunum <= 0) {
					this.$util.msg('库存不足');
					return false;
				}
				const data = {
					uid: uni.getStorageSync('uid'),
					gid: this.gid,
					num: this.num,
					thumbnail: this.dataobject.images[0],
					goodsName: this.dataobject.name,
					price: this.dataobject.newprice
				}
				return data;
			}
		},
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style scoped lang='scss'>
	.sku-name{
		color: #666666;
		font-size: 24upx;
	}
	/* 作者信息 */
	.column_img_con {
		width: 160rpx;
		height: 160rpx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;

		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 6rpx;
		}
	}

	.item_column {
		position: relative;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		border-bottom: 1px solid #F6F6F6;

		&:last-child {
			border: none;
		}
	}

	/* 作者信息 */
	.icon-you {
		font-size: 24rpx;
		color: #999999;
		margin-left: 10rpx;
	}

	.good_num {
		color: #ff0000 !important;
		margin-left: 10rpx;
	}

	.num-con {
		padding: 30rpx 20rpx;
		background: #FFFFFF;
		margin-top: 10rpx;
	}

	.main-wrap {
		opacity: 0;
		transition: .2s;

		&.show {
			opacity: 1;
		}
	}

	.cart_img_con {
		position: fixed;
		bottom: 200rpx;
		right: 40rpx;
	}

	.hot_bg {
		width: 442rpx;
		height: 42rpx;
		margin: 0 auto;
	}

	.img_icon_info {
		position: absolute;
		top: 0;
		left: 14%;
		right: 2%;
		height: 110rpx;
	}

	.check_icon {
		width: 40rpx;
		height: 40rpx;
	}

	.m-n-tips {
		font-size: 24rpx;
		color: #333333;
	}

	.vip_bg {
		width: 211rpx;
		height: 50rpx;
	}

	/* 标题简介 */
	.introduce {
		background: #fff;
		padding: 20rpx;

		.title {
			min-height: 44rpx;
			font-size: 32rpx;
			color: #333;
			line-height: 44rpx;
			font-weight: 700;
		}

		.price-wrap {
			min-height: 40rpx;
			/* margin-top: 28rpx; */
			width: 100%;
			position: relative;
		}

		.m-n-price {
			margin-right: 16rpx;
			color: #999999;
			font-size: 26rpx;
		}

		.m-price {
			margin-left: 10rpx;
			margin-right: 16rpx;
			color: #999999;
			font-size: 26rpx;
			text-decoration: line-through;
		}

		.tag {
			transform: translateY(4rpx);
			padding: 0 10rpx;
			margin-left: 8rpx;
			background: $base-color;
			font-size: 20rpx;
			color: #fff;
			line-height: 32rpx;
			border-radius: 4rpx;
			position: relative;
			bottom: 8rpx;
		}

		.bot {
			width: 100%;
			padding: 28rpx 0 10rpx 4rpx;
			font-size: 24rpx;
			color: #999;
			box-sizing: border-box;
		}
	}

	/*  详情 */
	.detail-desc {
		margin-top: 12rpx;
		background: #fff;
		padding: 20rpx;

		.d-header {
			line-height: 80rpx;
			font-size: 30rpx;
			color: #333;
			position: relative;
			padding-left: 20rpx;

			text {
				position: relative;
				font-size: 26rpx;
				font-weight: bold;
				color: #020202;
			}

			&:before {
				content: '';
				width: 6rpx;
				height: 24rpx;
				background: #020202;
				border-radius: 3rpx;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}

		}

	}
</style>
