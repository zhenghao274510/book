<template>
	<view class="list-container">
		<view id="wf-list" class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
			<view class="item" v-for="(item,index) of list.list" :key="index" style="background: #FFFFFF;" @click="stockDetails(item.postId)">
				<view class="column_img_con">
					<image @load="handleViewRender(listIndex,index)" @error="handleViewRender(listIndex,index)" :src="item.postThumbnail"
					 class="product_img" mode="scaleToFill"></image>
					 <image src="/static/img/play_list.png" mode="" class="play_image" v-if="item.postVideo!=''"></image>
				</view>

				<view class="desc uni-two-cut">{{item.postTitle}}</view>
				<view class="row" style="padding: 10rpx;">
					<image src="/static/img/yishoucang.png" class="look_icon"></image>
					<view class="">
						{{item.postBrowseNum}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array, //实际请求获取的列表数据
			}
		},
		data() {
			return {
				viewList: [{
					list: []
				}, {
					list: []
				}], //展示到视图的列表数据
				everyNum: 2
			}
		},
		watch: {
			list: {
				handler(n) {
					this.init()
				},
				deep: true
			}
		},
		methods: {
			init() {
				this.viewList = [{
					list: []
				}, {
					list: []
				}];
				setTimeout(() => {
					this.handleViewRender(0, 0)
				}, 0)
			},
			stockDetails(id) {
				if (uni.getStorageSync('uid')) {
					this.navTo(`/pages/product/article_details?id=${id}`);
				} else {
					this.navTo('/pages/public/author');
				}

			},
			handleViewRender(x, y) {
				const index = this.viewList.reduce((total, current) => total + current.list.length, 0)
				if (index > this.list.length - 1) {
					// 加载完成触发事件并返回加载过的图片数
					this.$emit('finishLoad', index)
					return
				};
				const query = uni.createSelectorQuery().in(this);
				let listFlag = 0;
				query.selectAll('#wf-list').boundingClientRect(data => {
					listFlag = data[0].bottom - data[1].bottom <= 0 ? 0 : 1;
					this.viewList[listFlag].list.push(this.list[index])
				}).exec()
			},
		}
	}
</script>

<style lang="less" scoped>
	.list-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 10rpx;

		.list {
			width: calc(50% - 7rpx);
			display: flex;
			flex-direction: column;

			.item {
				margin-bottom: 10rpx;
				padding: 0 0 10rpx 0;
				border-radius: 10rpx;
				.column_img_con {
					width: 100%;
					height: 360rpx;
					position: relative;
					.product_img {
						width: 100%;
						height: 100%;
						border-radius: 10rpx 10rpx 0 0;
					}
					.play_image{
						position: absolute;
						right: 20rpx;
						top: 20rpx;
						width: 48rpx;
						height: 48rpx;
					}
				}

				.desc {
					font-size: 26rpx;
					padding: 10rpx;
					line-height: 1.8;
				}
			}
		}
	}

	.look_icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 10rpx;
	}
</style>
