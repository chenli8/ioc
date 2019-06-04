/**
 * 常住人口流动页
 *
 * @CityPopulationSource 全市人口来源，汇总
 * CityPopulationSource.code              城市行政区划编码
 * CityPopulationSource.name              城市名称
 * CityPopulationSource.inflowPopulation  城市外来人口总量
 * CityPopulationSource.localPopulation   城市本地人口总量
 *
 * 
 */
// code: "371600"
// dateTime: "2018-12"
// inflowExternalRate: 8.95
// inflowLocalRate: 91.04
// inflowRanking: 1
// inflowTolal: 127551
// name: "滨州市"
// netInflowExternalRate: 19.59
// netInflowLocalRate: 80.41
// netInflowRanking: 1
// netInflowTolal: -16380
// outflowExternalRate: 61.01
// outflowLocalRate: 38.99
// outflowRanking: 1
// outflowTolal: 143931

import {
	cityResidentFlowInAndOut,
	cityResidentFlowTotal,
	cityResidentFlowIndex
} from '../../models/index';

const state = {
	init: false,
	cityResidentFlowType:0,//流动类型(0:流入 1:流出 2:净流入)
	cityResidentFlowList: [], //城市常住人口流入流出
	cityResidentFlowTotal: {}, // 城市常住人口流入、流出、净流入排名与来源去向
	cityResidentFlowIndex: [] // 省内常住流动人口指数排名
};

const getters = {

};

const mutations = {
	setResidentFlowInit(state, init){
		state.init = init;
	},
	setCityResidentFlowList(state, cityResidentFlowList){
		state.cityResidentFlowList = cityResidentFlowList;
	},
	setCityResidentFlowTotal(state, cityResidentFlowTotal){
		state.cityResidentFlowTotal = cityResidentFlowTotal;
	},
	setCityResidentFlowType(state,cityResidentFlowType){
		state.cityResidentFlowType = cityResidentFlowType;
	},
	setCityResidentFlowIndex(state, cityResidentFlowIndex){
		state.cityResidentFlowIndex = cityResidentFlowIndex;
	}
};

const actions = {
	updateResidentFlow({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityResidentFlowList',
			'updateCityResidentFlowTotal',
			'updateCityResidentFlowIndex'
		]).then( data => {
			commit('setResidentFlowInit', true);
			return data
		})
	},
	updateCityResidentFlowList({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityResidentFlowInAndOut,
			mutation: 'setCityResidentFlowList',
			outFilter
		})
	},
	updateCityResidentFlowTotal({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityResidentFlowTotal,
			mutation: 'setCityResidentFlowTotal',
			outFilter
		})
	},
	updateCityResidentFlowIndex({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityResidentFlowIndex,
			mutation: 'setCityResidentFlowIndex',
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