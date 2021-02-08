<template>
	<view class="content">
		<view class="column center" style="margin:50rpx auto;">
			<image class="logo" src="/static/logo.png"></image>
			<view class="" style="font-weight: bold;margin-top: 10upx;">
				戴胜鸟图书
			</view>
		</view>
		
		<view class="list-con">
			<view class="row between d-items-center b-b">
				<view class="reg-con">
					+86
				</view>
				<input type="number" value="" class="reg-input fill" maxlength="11" placeholder="请输入手机号" placeholder-class="placeClass"
				 v-model="phone" />
			</view>
			<view class="row between d-items-center b-b">
				<input type="password" value="" class="reg-input fill" placeholder="请输入密码" placeholder-class="placeClass" v-model="password" />
			</view>
			<view class="row between" style="padding: 20rpx 0;">
				<navigator url="../registe/index" style="color: #4CD964;font-size: 26rpx;">立即注册</navigator>
				<view class="">

				</view>
			</view>
		</view>
		<view class="reg-btn" hover-class="hover-opacity" @click="subOrder">
			登录
		</view>
		<label class='_label row'>
			<radio value="" :checked="checked" style="transform: scale(.6);" color="#007AFF" />
			<navigator url="/pages/public/index" style="font-size: 24rpx;"><text style="color: #666666;">我已阅读并同意 </text><text
				 style="color: #366092;">《用户协议》</text></navigator>
		</label>

	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		checkStr
	} from '@/common/js/util'
	export default {
		data() {
			return {
				phone: '',
				password: '',
				checked: true
			};
		},
		methods: {
			subOrder() {
				const {
					phone,
					password
				} = this;
				this.$util.throttle(async () => {
					if (phone == '') {
						this.$util.msg('请输入手机号!')
						return
					}
					if (!checkStr(phone, 'mobile')) {
						this.$util.msg('手机号格式不正确!')
						return
					}
					if (password == '') {
						this.$util.msg('请输入登录密码!')
						return
					}
					const data = {
						password: md5(password),
						phone
						
					}
					const res = await this.$request('userLogin', data, {
						showLoading: true
					});
					this.$util.msg(res.resultNote);
					if (res.result == 0) {
					    uni.setStorageSync('uid',res.uid);
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	._label{
		width: 750upx;
		padding-left: 8%;
		box-sizing: border-box;
	}
	.placeClass {
		color: #999999;
		font-size: 26upx;
	}

	.reg-con {
		width: 89upx;
		line-height: 46upx;
		background: #F6F6F6;
		text-align: center;
		border-radius: 4upx;
		margin-right: 20rpx;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.list-con {
		width: 85%;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
	}

	.d-items-center {
		align-items: center;
		padding: 20upx 0;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.reg-img {
		width: 35upx;
		height: 43upx;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}

	.reg-input {
		height: 80upx;
		font-size: 28upx;
	}

	.reg-btn {
		width: 85%;
		height: 77upx;
		background: #44D685;
		border-radius: 39upx;
		margin: 40upx auto 30upx;
		text-align: center;
		line-height: 77upx;
		color: #FFFFFF;
		font-size: 34upx;
		font-weight: bold;
	}
</style>
