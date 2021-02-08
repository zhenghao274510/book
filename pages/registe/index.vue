<template>
	<view class="content">
		<evan-form class="center-con" :hide-required-asterisk="false" label-position="top" :label-style="labelStyle" ref="form"
		 :model="userInfo">
			<view class="list-con">
				<evan-form-item prop="phone" label="手机号码" >
					<view class="d-items-center b-b fill" style="padding-bottom: 20rpx;">
						<input type="number" maxlength="11" class="reg-input" placeholder="请输入手机号" placeholder-class="placeClass" v-model="userInfo.phone" />
					</view>
				</evan-form-item>
				<evan-form-item prop="password" label="确认密码">
					<view class="d-items-center b-b fill" style="padding-bottom: 20rpx;">
						<input type="password" maxlength="6" value="" class="reg-input" placeholder="请输入密码" placeholder-class="placeClass" v-model="userInfo.password" />
					</view>
				</evan-form-item>
				<evan-form-item prop="code" label="验证码">
					<view class="row between d-items-center b-b fill" style="padding-bottom: 20rpx;">
						<input type="number" maxlength="6" value="" class="reg-input fill" placeholder="短信验证码" placeholder-class="placeClass" v-model="userInfo.code" />
						<text class="y-z-m" @click="checkPhone" hover-class="hover-opacity">{{rTime}}<text v-if="btnState">s后重发</text></text>
					</view>
				</evan-form-item>
				<evan-form-item prop="code" label="邀请码（选填）">
					<view class="d-items-center b-b fill" style="padding-bottom: 20rpx;">
						<input type="text" value="" class="reg-input" placeholder="请输入邀请码" disabled="true" placeholder-class="placeClass"
						 v-model="invitationcode" />
					</view>
				</evan-form-item>
			</view>
		</evan-form>
		<label class="_label row">
			<radio value="" :checked="true" style="transform: scale(.6);" color="#F55555" />
			<navigator url="/pages/public/index"
			 style="font-size: 24rpx;"><text
				 style="color: #666666;">我已阅读并同意 </text><text style="color: #366092;">《用户协议》</text></navigator>
		</label>
		<view class="reg-btn" hover-class="hover-opacity" @click="subOrder">
			注 册
		</view>
		<mix-modal title="温馨提示" ref="mixmodal" text="该手机号已注册" confirmText="立即前往" @onConfirm="onConfirm"></mix-modal>
        <mix-loading v-if="isLoading" :mask="true"></mix-loading>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		checkStr
	} from "@/common/js/util.js";
	import evanFormItem from "@/components/evan-form-item/evan-form-item.vue";
	import evanFrom from "@/components/evan-form/evan-form.vue";
	export default {
		components: {
			evanFrom,
			evanFormItem
		},
		data() {
			return {
				labelStyle: {
					"font-size": "28upx",
					"color": "#333",
					"font-weight": "bold"
				},
				rTime: '获取验证码',
				interval: null,
				btnState: false,
				type:0,
				userInfo: {
					phone: '',
					password: '',
					code: ''
				}

			};
		},
		onLoad(options) {
			options.type?this.type=options.type:0;
			options.invitationcode ? this.invitationcode = options.invitationcode : 0;
		},
		methods: {
			onConfirm() {
				uni.navigateBack();
			},
			checkPhone() {
				this.$util.throttle(async () => {
					if (this.rTime !== '获取验证码') {
						return
					}
					const data = {
						phone: this.userInfo.phone
					};
					if (data.phone == '') {
						this.$util.msg('请输入手机号');
						return
					}
					if (!checkStr(data.phone, 'mobile')) {
						this.$util.msg('请输入正确手机号');
						return
					}
					const res = await this.$request('phoneRegister', data);
					if (res.result == 0) {
						// "isregister":"0未注册 1已注册"
						if (res.isregister == 1) {
							this.showPopup('mixmodal');
						} else {
							this.getYZM(data);
						}
					}
				})
			},
			async getYZM(data) {
				if (this.rTime == '获取验证码') {
					this.rTime = 60;
					this.btnState = true;
					this.interval = setInterval(() => {
						if (--this.rTime <= 0) {
							this.rTime = '获取验证码';
							clearInterval(this.interval);
							this.btnState = false;
						}
					}, 1000);
					const res = await this.$request('getValidateCode', data, {
						showLoading: true
					});
					this.$util.msg(res.resultNote);
					if (res.result == 0) {
						this.userInfo.code = res.code;
					}
				}
			},
			async subOrder() {
				const {
					phone,
					code,
					password
				} = this.userInfo;
				if (phone == '') {
					this.$util.msg('请输入手机号');
					return
				}
				if (!checkStr(phone, 'mobile')) {
					this.$util.msg('请输入正确手机号');
					return
				}
				if (code == '') {
					this.$util.msg('请输入验证码');
					return
				}
				if (password == '') {
					this.$util.msg('密码不能为空');
					return
				}
				const data={
					password:md5(password),
					invitationcode:this.invitationcode,
					phone,
					code
				}
				const res = await this.$request('userRegister', this.userInfo, {
					showLoading: true
				});
				this.$util.msg(res.resultNote);
				if (res.result == 0) {
					if(this.type==0){
						setTimeout(()=>{
							uni.navigateBack();
						},800)
					}else{
						setTimeout(()=>{
							uni.reLaunch({
								url:'/pages/login/download'
							})
						},800)
					}
				}
			}
		},
		onHide() {
			if (this.interval) {
				clearInterval(this.interval);
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

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.center-con {
		width: 750upx;
		padding: 30upx;
		box-sizing: border-box;
	}

	.list-con {}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 70rpx auto;
	}

	.d-border {
		position: relative;
		border-bottom: 1px solid #F2F2F2;
		padding: 40upx 0;
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
		height: 50upx;
		font-size: 28upx;
	}

	.y-z-m {
		width: 200upx;
		line-height: 66upx;
		color:#333333;
		font-size: 24upx;
		position: relative;
		background: #F6F6F6;
		border-radius: 33rpx;
		text-align: center;
	}

	// .y-z-m::before {
	// 	content: '';
	// 	width: 2upx;
	// 	height: 22upx;
	// 	background-color: #E7E7E7;
	// 	position: absolute;
	// 	top: 50%;
	// 	transform: translateY(-50%);
	// 	left: -30upx;
	// }

	.reg-btn {
		width: 85%;
		height: 77upx;
		background: #F55555;
		border-radius: 39upx;
		margin: 40upx auto 30upx;
		text-align: center;
		line-height: 77upx;
		color: #FFFFFF;
		font-size: 34upx;
		font-weight: bold;
	}
</style>
