/**
 * @Method Description
 * @Author: hao zheng@
 * @Description:In User Settings Edit
 * @LastEditors: Please set LastEditors
 * @param {}
 * @return 
 * @createTime: 2020-12-9 11:15:13
 */


import {
	request
} from '@/common/js/request'
const bassUrl = require('@/common/js/config.js').bass;
import {
	msg
} from "@/common/js/util.js"

export default {
	data(){
		return {
			isLoading: false, //刷新数据
			loaded: false, //加载完毕
			invitationcode:''
		}
	},
	methods: {
		/**
		 * @Description point something to window
		 */
		log(data) {
			console.log(JSON.parse(JSON.stringify(data)))
		},
		/**
		 * @Description Navigate to  some page of this project and judge user has login
		 * @options {}  judge user has login
		 * @url {}  Navigate to  some page path
		 */
		navTo(url, options = {}) {
			this.$util.throttle(() => {
				if (!url) {
					return;
				}
				if ((~url.indexOf('login=1') || options.login) && !uni.getStorageSync('uid')) {
					url = '/pages/public/author';
				}
				uni.navigateTo({
					url
				})
			}, 300)
		},
		regPhone(phone) {
			var reg= new RegExp(/^[1][3456789]\d{9}$/)
			if (reg.test(phone)) {
				return true;
			} else {
				return false;
			}	
		},
		callphone(phone) {
			this.$util.throttle(() => {
				if (!phone) {
					return;
				}
				uni.makePhoneCall({
					phoneNumber: phone
				})
			}, 300)
		},
		/**
		 * @Description get data from  back-end and judge user has login
		 * @options {}  judge user has login
		 * @url string request back-end interface  need path
		 * @data {}  request back-end interface need parameter
		 */
		$request(url, data = {}, options = {}, ext={}){
			if(options.login && !uni.getStorageSync('uid')){
				uni.reLaunch({
					url:'/pages/public/author'
				})
				return
			}
			if(options.showLoading){
				this.isLoading = true;
			}
			return new Promise((resolve, reject)=> {
				request(url, data, options, ext).then(result => {
					if(ext.hideLoading !== false){
						this.isLoading = false;
					}
					setTimeout(()=>{
						if(this.setLoaded !== false){
							this.loaded = true;
						}
					}, 100)
					this.$refs.confirmBtn && this.$refs.confirmBtn.stop();
					resolve(result);
				}).catch((err) => {
					reject(err);
				})
			})
		},
		/**
		 * @Description upload file to back-end
		 * @url string   request back-end interface  need path
		 * @data {}  request back-end interface need parameter
		 */
		$uploadFile(url, data = {}) {
			return new Promise((e, n) => {
				const uploadTask = uni.uploadFile({
					url: encodeURI(bassUrl + '/api/' + url),
					filePath: data.filePath.path,
					name: 'file',
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'Content-Type': 'multipart/form-data;'
					},
					success: function(res) {
						200 == res.statusCode ? e(res.data) : msg(`错误码:${res.statusCode}`);
					},
					fail: function(err) {
						"request:fail " === err.errMsg && msg("请求数据失败！"), n(err.data);
					}
				});
				uploadTask.onProgressUpdate((res) => {
					data.progress = res.progress;

				});
			})
		},
		/**
		 * @Description show image is in lazyload but this is only  use  scoll-view
		 * @data  current can show  image
		 */
		imageOnLoad(data, key) {
			setTimeout(() => {
				this.$set(data, 'loaded', true);
			}, 100)
		},
		/**
		 * @Description the templete has  show  do  something
		 * @key string  the templete name  or ref
		 */
		showPopup(key) {
			this.$util.throttle(() => {
				this.$refs[key].open();
			}, 200)
		},
		/**
		 * @Description the templete has  hide  do  something
		 * @key string  the templete name  or ref
		 */
		hidePopup(key) {
			this.$refs[key].close();
		},
		stopPrevent() {},
	},
}
