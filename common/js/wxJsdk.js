/**
 * @Method Description
 * @Author: hao zheng@
 * @Description:In User Settings Edit
 * @LastEditors: 微信公众号  jsdk    分享  定位  获取签名等
 * @param {}
 * @return 
 * @createTime: 2020-9-9 14:14:17
 */

const jweixin = require('jweixin-module');
const bassurl=require('./config.js').bass;
import {request} from './request.js'
export default {
	//判断是否在微信中
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	initJssdk: function(callback) {
		var url =encodeURIComponent(location.href.split('#')[0]);
		request('login/share',{
			url:url
		}).then(res => {
			jweixin.config({
				debug: false,
				appId: res.body.appId,
				timestamp: res.body.timestamp,
				nonceStr: res.body.noncestr,
				signature: res.body.signature,
				url:url,
				jsApiList: ['onMenuShareAppMessage',
					'onMenuShareTimeline',
					'chooseWXPay',
					'showOptionMenu',
					"updateAppMessageShareData",
					"hideMenuItems",
					"showMenuItems",
					"onMenuShareTimeline",
					'onMenuShareAppMessage'
				]
			});
			if (callback) {
				console.log(res)
				callback(res);
			}
		})
	},
	share: function(data, callback) {
		let path='';
		if(typeof data!="object"){
			data={}
		}
		if(window.location.href.replace(window.location.search,'').indexOf('?')!=-1){
			path=window.location.href.replace(window.location.search,'')+'&inviteCode='+uni.getStorageSync('uid')
		}else{
			path=window.location.href.replace(window.location.search,'')+'?inviteCode='+uni.getStorageSync('uid')
		}
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(res) {
			jweixin.ready(function() {
				var shareData = {
					title: data.title || '阪盛',
					desc: data.desc || '为你推荐这家店铺优质商品,快来看看',
					link: data.path || path,
					imgUrl: data.imageUrl || `${bassurl}/static/logo.png` ,
					success: function(res) {
						callback(res)
						// 分享后的一些操作,比如分享统计等等
					},
					cancel: function(res) {}
				};
				console.log(shareData);
				jweixin.onMenuShareAppMessage(shareData);
				//分享到朋友圈接口
				jweixin.onMenuShareTimeline(shareData);
			});
		});
	}
}
