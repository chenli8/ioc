/**
 * 劳动力人口流动页
 *
 *
 * 
 */

import {
	cityWorkerFlowInAndOut,
	cityWorkerFlowTotal,
	cityWorkerFlowIndex
} from '../../models/index';

const state = {
	init: false,
	cityWorkerFlowType: 0,//流动类型(0:流入 1:流出 2:净流入)
	cityWorkerFlowList: [], //城市常住人口流入流出
	cityWorkerFlowTotal: {}, // 城市常住人口流入、流出、净流入排名与来源去向
	cityWorkerFlowIndex: [] // 省内常住流动人口指数排名
};

const getters = {

};

const mutations = {
	setWorkerFlowInit(state, init){
		state.init = init;
	},
	setCityWorkerFlowList(state, cityWorkerFlowList){
		state.cityWorkerFlowList = cityWorkerFlowList;
	},
	setCityWorkerFlowTotal(state, cityWorkerFlowTotal){
		state.cityWorkerFlowTotal = cityWorkerFlowTotal;
	},
	setCityWorkerFlowType(state,cityWorkerFlowType){
		state.cityWorkerFlowType = cityWorkerFlowType;
	},
	setCityWorkerFlowIndex(state, cityWorkerFlowIndex){
		state.cityWorkerFlowIndex = cityWorkerFlowIndex;
	}
};

const actions = {
	updateWorkerFlow({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityWorkerFlowList',
			'updateCityWorkerFlowTotal',
			'updateCityWorkerFlowIndex'
		]).then( data => {
			commit('setWorkerFlowInit', true);
			return data
		})
	},
	updateCityWorkerFlowList({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityWorkerFlowInAndOut,
			mutation: 'setCityWorkerFlowList',
			outFilter
		})
	},
	updateCityWorkerFlowTotal({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityWorkerFlowTotal,
			mutation: 'setCityWorkerFlowTotal',
			outFilter
		})
	},
	updateCityWorkerFlowIndex({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityWorkerFlowIndex,
			mutation: 'setCityWorkerFlowIndex',
			filterType: 'provinceFilter',
			outFilter
		})
		
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};