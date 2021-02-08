<template>
	<uni-popup ref="popup" type="center">
		<view class="content">
			<view class="">
				退款原因
			</view>
			<view class="" style="padding: 30rpx 0;">
				<xfl-select :list="list" :clearable="false" :listShow="false" :isCanInput="false" placeholder="请选择" initValue="请选择"
				 :listTop="40" :selectHideType="'hideAll'" @change="choseReson">
				</xfl-select>
			</view>
			<view class="">
				退款说明
			</view>
			<view class="">
				<textarea class="input fill" auto-height v-model="reason"  />
				</view>
			<view class="btn" @click="userOptions">
				提交
			</view>
		</view>
	</uni-popup>
</template>

<script>
	/**
	 * 底部选择菜单
	 */
	import xflSelect from "../xfl-select/xfl-select.vue"
	export default {
		components:{
			xflSelect
		},
		props:{
			list:{
				type:Array,
				default(){
					return[]
				}
			},
			itemId:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				reason:'',
				orignItem:{}
			};
		},
		methods: {
			//选择回调
			confirm(item){
				this.$util.throttle(()=>{
					this.$emit('onConfirm', item)
				})
				this.close();
			},
			open(data){
				this.data = data;
				this.$refs.popup.open();
			},
			choseReson(e){
				console.log(e)
				this.orignItem=e.orignItem;
			},
			close(){
				this.$refs.popup.close();
			},
			userOptions(){
				if(!this.orignItem.reasonId){
					this.$util.msg('请选择退款原因!');
					return
				}
				if(this.reason==''){
					this.$util.msg('请输入退款说明!');
					return
				}
				let data={
					reasonId:this.orignItem.reasonId,
					reason:this.reason,
					itemId:this.itemId
				}
				this.$emit('onConfirm',data)
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		background-color: #fff;
		border-radius: 16rpx;
		margin: 0 auto;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.btn{
		width: 604rpx;
		line-height: 66rpx;
		text-align: center;
		background: #FF4C83;
		border-radius: 33rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFEBF1;
		margin-top:50rpx;
	}
	.input{
		min-height: 180rpx;
		font-size: 28rpx;
		color: #333;
		padding: 10rpx;
		width: 100%;
		margin-top:20rpx;
		background-color:#FAFAFA;
	}
</style>
