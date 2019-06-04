import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import {getLocationParams} from './lib/util.js'
Vue.config.productionTip = false;

/**
 * 为router添加拦截，保证初始进入系统时，先请求city默认信息
 * @param  {[type]} (to, from,         next [description]
 * @return {[type]}      [description]
 */
router.beforeEach((to, from, next) => {
	let {cityInfo} = store.state;
	
	if(cityInfo.isInit){
		next();
	}else{
		let {city} = getLocationParams();

		//city 信息通过URL query 从京东传过来，现在暂时写死
        // if(!city) alert('获取城市信息失败');
				city = city || '371600';//滨州市
				// city = city || '450500';//北海市

		store.dispatch('updateCityInfo', city).then( _ => {
			next();
		})
	}
	
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
