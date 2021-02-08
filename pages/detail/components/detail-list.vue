<template>
	<view class="page_view">
		<view class="item_row_con" v-if="listType=='row'">
			<view class="item_row" style="flex-direction: column;" v-for="(v,k) in list" :key="k" @click.stop="stockDetails(v.gid)">
				<view class="row_img_con">
					<image :src="v.image" mode="aspectFill" lazy-load="true"></image>
				</view>
				<view class="uni-second-price">
					<view class="uni-second-title">{{v.name}}
					</view>
					<mix-old-price :price="v.oldprice" type='list'></mix-old-price>
					<view class="sku-name row">
						<view class="">
							<mix-price-view :price="v.newprice"></mix-price-view>
						</view>
						<image src="/static/img/tianjia.png" class="img pos"></image>
					</view>
					
				</view>
			</view>
		</view>
		<view class="" v-if="listType=='column'">
			<view class="item_column" v-for="(v,k) in list" :key="k" @click.stop="stockDetails(v.gid)">

				<view class="column_img_con">
					<image :src="v.image" mode="aspectFill" lazy-load="true"></image>
				</view>
				<view class="fill" style="position: relative;">
					<view class="uni-second-title">{{v.name}}
					</view>
					<view class="row between">
						<view class="sku-name row">
							<view class="">
								<mix-price-view :price="v.newprice"></mix-price-view>
							</view>
							<mix-old-price :price="v.oldPrice "></mix-old-price>
						</view>
						<image src="/static/img/tianjia.png" class="img"></image>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import mixPriceView from "@/components/mix-price-view/mix-price-view.vue"
	import mixOldPrice from "@/components/mix-old-price/mix-old-price.vue"
	export default {
		components: {
			mixPriceView,
			mixOldPrice
		},
		props: {
			totype: {
				type: String,
				default: 'ordinary'
			},
			listType: {
				type: String,
				default: 'row'
			},
			list: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				gid: '',
			}
		},
		methods: {
			stockDetails(id) {
				this.$emit('click', id)
			}
		}
	}
</script>
<style scoped lang="scss">
	.scale_num {
		font-size: 20rpx;
		color: #999999;
	}

	.item_row_con {
		display: flex;
		flex-wrap: wrap;
	}

	.item_row {
		margin: 0 0 20upx 20upx;
		width: 46%;
		background: #FFFFFF;
		position: relative;
	}

	.tags_icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 64upx;
		height: 64upx;
		z-index: 99;
	}

	.row_img_con {
		width: 100%;
		height: 334upx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}
	}

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

	.pos {
		position: absolute;
		right: 25upx;
		bottom: 20upx;
	}

	.img {
		width: 40upx;
		height: 40upx;
		z-index: 999;
	}

	.second-title {
		padding: 40upx 20upx;
		width: 94%;
		box-sizing: border-box;
		margin: 0 auto;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20upx 20upx 0 0;
	}

	.uni-second-title {
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		color: #000000;
		line-height: 1.5;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		padding: 10rpx 0;
		font-weight: bold;
	}

	.uni-second-price {
		flex: 1;
		font-size: 28upx;
		line-height: 1.5;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20upx 10upx;
	}
</style>
