import Vue from 'vue'
import App from './App'
import {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date,
	setNav,
	checkStr,
	fromContent
} from '@/common/js/util'
import filter from './common/filter/filter'
import mixin from '@/common/mixin/mixin'
Vue.mixin(mixin) 
Vue.prototype.$util = {
	msg,
	isLogin,
	debounce,
	throttle,
	prePage,
	date,
	setNav,
	checkStr,
	fromContent
}
// import wechat from '@/common/js/wxJsdk.js'
// Vue.prototype.$wechat = wechat;
// 注册全局组件
import sPullScroll from "@/components/s-pull-scroll/index.vue"
import mixButton from "@/components/mix-button/mix-button.vue"
import mixLoading from "@/components/mix-loading/mix-loading.vue"

Vue.component('s-pull-scroll',sPullScroll);
Vue.component('mix-button',mixButton);
Vue.component('mix-loading',mixLoading);
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
