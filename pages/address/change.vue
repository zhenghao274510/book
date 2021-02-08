<template>
	<view class="app" :style="{height:height+'px'}">
		<view class="cell row b-b">
			<text class="tit tips">收货人</text>
			<input class="input" type="text" maxlength="10" v-model="address.name" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="cell row b-b">
			<text class="tit tips">手机号码</text>
			<input class="input" type="number" maxlength="11" v-model="address.phone" placeholder="请输入收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="cell row  fill" @click="chooseAddress">
			<text class="tit">国内</text>
			<text class="input clamp" :class="{placeholder: !address.address}">
				{{ address.address ? address.address:'请选择收货地址' }}
			</text>
			<text class="mix-icon icon-you"></text>
		</view>
		<view class="cell row b-b">
			<text class="tit tips">详细地址</text>
			<input class="input" type="text" v-model="address.addressdetail" placeholder="请输入详细地址" placeholder-class="placeholder" />
		</view>
		<view class="cell row b-b">
			<text class="tit fill">设为默认地址</text>
			<switch :checked="address.isdefault==1" style="transform: scale(.7);" color="#44D685" @change="onSwitchChange" />
		</view>

		<view class="fixed_massage">
			<mix-button ref="confirmBtn" text="提交" marginTop="60rpx" @onConfirm="submit"></mix-button>
		</view>
		<picker-city ref='picker' :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#038980'></picker-city>
		<mix-loading v-if="isLoading" :mask="true"></mix-loading>
	</view>
</template>

<script>
	import {
		checkStr
	} from '@/common/js/util'
	import pickerCity from "@/components/mpvue-citypicker/mpvueCityPicker.vue"
	export default {
		components: {
			pickerCity
		},
		data() {
			return {
				cityPickerValueDefault: [0, 0, 0],
				height: uni.getSystemInfoSync().screenHeight,
				address: {
					addressid: "", //地址id
					isdefault: "", //是否默认地址（0：否；1：是；）
					name: "", //联系人
					phone: "", //联系电话
					address: "", //地区
					addressdetail: "" //地址K
				}
			}
		},
		onLoad(options) {
			this.address = JSON.parse(options.data);
			console.log(this.address)
		},
		methods: {
			onConfirm(e) {
				console.log(e)
				this.address.address = e.label;
			},
			submit() {
				this.$util.throttle(async () => {
					const data = this.address;
					if (!data.name) {
						this.$util.msg('请输入收货人姓名');
						this.$refs.confirmBtn.stop();
						return;
					}
					if (!checkStr(data.phone, 'mobile')) {
						this.$util.msg('请输入正确的手机号码');
						this.$refs.confirmBtn.stop();
						return;
					}
					if (!data.address) {
						this.$util.msg('请选择您的收货地址');
						this.$refs.confirmBtn.stop();
						return;
					}
					if (!data.addressdetail) {
						this.$util.msg('请输入您的详细地址');
						this.$refs.confirmBtn.stop();
						return;
					}
					const parmas = {
						uid: uni.getStorageSync('uid'),
						isdefault: data.isdefault,
						name: data.name,
						phone: data.phone,
						addressdetail: data.addressdetail,
						address: data.address,
						addressid: data.addressid
					}
					const res = await this.$request('addAddress', parmas,{showLoading:true});
					this.$util.msg(res.resultNote);
					if (res.result == 0) {
						setTimeout(() => {
							uni.navigateBack();
						}, 500)
					}
				})

			},
			//选择地址
			chooseAddress() {
				this.$refs['picker'].show()
			},
			onSwitchChange(e) {
				console.log(e)
				e.detail.value ? this.address.isdefault = 1 : this.address.isdefault = 0;
			}
		}
	}
</script>

<style scoped lang="scss">
	.tips {
		&::before {
			content: '*';
			color: #FF4C83;
			margin-right: 10rpx;
		}
	}

	.fixed_massage {
		position: fixed;
		left: 50%;
		bottom: 60rpx;
		transform: translateX(-50%);
	}

	.app {
		padding: 10rpx 20rpx 0;
	}

	.cell {
		height: 106rpx;

		.tit {
			min-width: 150rpx;
			font-size: 26rpx;
			color: #666666;
		}

		.input {
			flex: 1;
			font-size: 26rpx;
			color: #333;
		}

		.icon-you {
			flex-shrink: 0;
			margin-right: 8rpx;
			margin-left: 40rpx;
			font-size: 24rpx;
			color: #aaa;
		}

		switch {
			transform: scale(0.8) translateX(10rpx);
			transform-origin: center right;
		}
	}
</style>
