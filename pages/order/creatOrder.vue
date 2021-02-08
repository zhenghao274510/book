<template>
	<view class="view_swiper">
		<view class="main-wrap" :class="{show: loaded}">
			<view class="addr-sec" @click="navTo('/pages/address/index?choose=1&id='+addr.addressid)">
				<view v-if="!addr.addressid" class="addr-empty row fill">
					<view class="mix-icon icon-dizhi"></view>
					<view>请选择收货地址</view>
				</view>
				<view v-else class="addr-wrap">
					<text class="mix-icon icon-dizhi"></text>
					<view class="con">
						<view class="addr">{{ addr.area }} {{ addr.address}}</view>
						<view class="name">{{ addr.name }} {{ addr.phone }}</view>
					</view>
					<text class="mix-icon icon-you"></text>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="goods-sec">
				<product-list :list="dataList"></product-list>
			</view>
			<view class="price-sec">
				<view class="cell row">
					<text class="tit fill">运费</text>
					<text style="font-size: 26rpx;color:#E9463D;">免运费</text>
				</view>
			</view>
			<view class="remarks">
				<view class="title">订单备注：</view>
				<textarea class="input fill" auto-height v-model="remarks" placeholder="请填写备注文字信息~" placeholder-style="color: #999" />
				</view>
			<!-- 底部栏 -->
			<view class="bot-fill-view"></view>
			<view class="bottom row">
				<view class="fill row">
					<view class="tip">
						<text>共{{num}}件商品</text>
					</view>
					<view class="">
						<text class="tip">合计:</text>
						<text class="price fill">￥{{ goodsTotal | price(2) }}</text>
					</view>
				</view>
				<view class="btn center" @click="createOrder">
					立即支付
				</view>
			</view>
		</view>
		<mix-loading v-if="isLoading"  :mask="true"></mix-loading>
	</view>
</template>

<script>
	import productList from './components/product-list.vue'
	export default {
		components: {
			productList
		},
		data() {
			return {
				createType:'',
				remarks: '', //备注
				addr: {},//地址信息
				dataList:[],
				shopcarIds:[],
				orderNumber:'',
				num:0
			}	
		},
		computed: {
			//商品总价
			goodsTotal(){
				if(this.dataList.length === 0){
					return 0;
				}
				let total = 0,num=0;
				this.dataList.forEach(item=> {
					total +=item.price*100 * item.num;
					num+=item.num;
				})
				this.num=num;
				return total/100;
			}
		},
		onLoad(options) {
			this.dataList =JSON.parse(decodeURIComponent(options.goods));
			console.log(this.dataList)
			this.getDefaultAddress();
			if(options.type){
				this.createType=options.type;
			}
		},
		methods: {
			//创建订单
			createOrder(){
				this.$util.throttle(async ()=>{
					if(!this.addr.addressid){
						this.$util.msg('请选择收货地址');
						return;
					}
					const data = this.getCreateData();
					const res = await this.$request('immediatelypurchase',data,{showLoading:true});
					if(res.result ==0){
						const paydata={
							uid:uni.getStorageSync('uid'),
							orderNumber:res.orderNumber,
							price:this.payTotal,
							type:this.createType
						}
						this.pay(paydata);
					}else{
						this.$util.msg(res.resultNote);
					}
				})
			},
			async pay(data){
				const res=await this.$request('weixinpay',data,{showLoading:true});
				if(res.result==0){
					console.log(res)
				}else{
					this.$util.msg(res.resultNote)
				}
			},
			//获取创建订单参数
			getCreateData(){
				const data = {
					uid:uni.getStorageSync('uid'),
					gid:this.dataList[0].gid,
					remarks: this.remarks,
					addressid: this.addr.addressid,
					numbers:this.num
				}
				return data;
			},
			//设置收货地址
			setAddress(addr){
				this.addr = addr;
			},
			//  默认收货地址
			async getDefaultAddress(){
				const res=await this.$request('myAddressList',{uid:uni.getStorageSync('uid')},{showLoading:true});
				if(res.dataList.length!=0){
					const addr=res.dataList.find(item =>{item.isdefault});
					if(addr){
						this.addr=addr;
					}
				}
				
			},
		}
	}
</script>

<style>
	page{
		background-color: #f7f7f7;
	}
</style>
<style scoped lang="scss">
	.icon-img{
		width: 30rpx;
		height: 35rpx;
		margin-right: 20rpx;
	}
	.b-b:after{
		left: 4rpx;
		right: 4rpx;
		border-color: #ececec;
	}
	.app{
		padding: 16rpx 24rpx 20rpx;
	}
	.main-wrap{
		opacity: 0;
		transition: .2s;
		width: 100%;
		
		&.show{
			opacity: 1;
		}
	}
	.addr-sec{
		display: flex;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		position: relative;
		overflow: hidden;
		
		.addr-empty{
			margin: 16rpx 0 24rpx;
			font-size: 30rpx;
			color: #666;
			
			.icon-dizhi{
				transform: translateY(0rpx);
				margin-right: 16rpx;
			}
		}
		.addr-wrap{
			display: flex;
			flex: 1;
			align-items: center;
		}
		.icon-dizhi{
			transform: translateY(6rpx);
			font-size: 32rpx;
			color:#999999;
		}
		.icon-you{
			flex-shrink: 0;
			transform: translateY(50%);
			position: relative;
			top: -14rpx;
			font-size: 26rpx;
			color: #999;
		}
		.con{
			flex: 1;
			padding: 40rpx  20rpx;;
		}
		.addr{
			margin-bottom: 16rpx;
			font-size: 28rpx;
			color: #000;
			line-height: 1.4;
		}
		.name{
			font-size: 24rpx;
			color: #999;
		}
		.bg{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 4rpx;
		}
	}
	.goods-sec{
		margin-top: 16rpx;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		overflow: hidden;
	}
	.price-sec{
		padding: 10rpx 0;
		margin-top: 14rpx;
		border-radius: 0 0 10rpx 10rpx;
		background-color: #fff;
		
		.cell{
			padding:20rpx;
			font-size: 26rpx;
			color: #333;
		}
		.price{
			font-weight: 700;
			
			&.red{
				color: $base-color;
			}
			&.disabled{
				color: #999;
				font-weight: normal;
			}
		}
		.total{
			justify-content: flex-end;
			height: 80rpx;
			padding-right: 20rpx;
			margin-top: 16rpx;
			font-size: 30rpx;
			color: #333;
			
			.price:before{
				content: '小计：';
				font-weight: normal;
			}
		}
		.tag{
			padding: 6rpx 8rpx;
			margin-right: 8rpx;
			font-size: 20rpx;
			color: #fff;
			border-radius: 8rpx;
			background-color: orange;
			
			&.red{
				background-color: $base-color;
			}
		}
		.icon-you{
			margin-left: 8rpx;
			font-size: 20rpx;
			color: #999;
		}
	}
	.remarks{
		padding:20rpx;
		margin: 16rpx 0;
		border-radius: 12rpx;
		background-color: #fff;
		
		.title{
			margin-bottom: 24rpx;
			font-size: 30rpx;
			color: #333;
			font-weight: 700;
		}
		.input{
			width:710rpx;
			min-height: 180rpx;
			font-size: 28rpx;
			color: #333;
			padding: 10rpx;
		}
	}
	.bot-fill-view{
		width: 100%;
		height: 100rpx;
		box-sizing: content-box;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom); 
	}
	.bottom{
		position: fixed;
		left:50%;
		bottom: 0;
		z-index: 90;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx 0 rgba(0,0,0,.06);
		box-sizing: content-box;
		transform: translateX(-50%);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom); 
		
		.tip{
			margin-left: 20rpx;
			font-size: 26rpx;
			color:#333333;
		}
		.price{
			margin-right: 30rpx;
			font-size: 36rpx;
			color: $base-color;
			font-weight: 700;
			text-align: right;
		}
		.btn{
			width: 259rpx;
			line-height: 70rpx;
			margin-right: 20rpx;
			border-radius: 100rpx;
			text-align: center;
			background-color: $base-color;
			font-size: 30rpx;
			color: #fff;
		}
	}
</style>
