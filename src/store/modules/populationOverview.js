/**
 * 人口运行概览页
 *
 * @CityPopulationSource 全市人口来源，汇总
 * CityPopulationSource.code              城市行政区划编码
 * CityPopulationSource.name              城市名称
 * CityPopulationSource.inflowPopulation  城市外来人口总量
 * CityPopulationSource.localPopulation   城市本地人口总量
 *
 * 
 */

import {
	countyWeekTrend,
	cityFlowResident,
	cityFlowWorker,
	cityTotalPopulation,
	countyTotalPopulation
} from '../../models/index';

const state = {
	init: false,
	cityFlowResident: [], //城市人口流动
	cityFlowWorker: [], //城市劳动力流动
	countyWeekTrend: [], //区县周人口趋势
	// cityPopulationSource: {}, // 移动至populationSource模块
	// citySourceList: [], // 移动至populationSource模块
	
	// countyWork: [],//去哪里工作，在workLive模块获取
	// countyLive: [],//去哪里居住，在workLive模块获取
	// countyCommuting: {},
	cityTotalPopulation: 0, //
	countyTotalPopulation: []
};

const getters = {

};

const mutations = {
	setOverviewInit(state, init){
		state.init = init;
	},
	setCityFlowResident(state, cityFlowResident){
		state.cityFlowResident = cityFlowResident;
	},
	setCityFlowWorker(state, cityFlowWorker){
		state.cityFlowWorker = cityFlowWorker;
	},
	setCountyWeekTrend(state, countyWeekTrend){
		state.countyWeekTrend = countyWeekTrend;
	},
	setCityTotalPopulation(state, cityTotalPopulation){
		state.cityTotalPopulation = cityTotalPopulation;
	},
	setCountyTotalPopulation(state, countyTotalPopulation){
		state.countyTotalPopulation = countyTotalPopulation;
	}
};

const actions = {
	/**
	 * 
	 * @param  {[type]} options.dispatch [description]
	 * @return {[type]}                  [description]
	 */
	updatePopulationOverview({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityFlowResident',
			'updateCityFlowWorker',
			'updateSourceAndList',
			'updateCityTotalPopulation',
			'updateCountyTotalPopulation',
			'updateCountyCommuting'
		]).then( data => {
			commit('setOverviewInit', true);
			return data
		})
	},
	updateCountyData({ dispatch }){
		let actions = [
				'updateCountyWorkLive',
				'updateCountyWeekTrend',
				'updateCountyStructureList'
			],
			promises = actions.map( action => dispatch(action) );

		return Promise.all(promises)
	},
	updateCountyWeekTrend({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: countyWeekTrend,
			mutation: 'setCountyWeekTrend',
			filterType: 'countyTrendFilter',
			outFilter
		})
	},
	updateCityFlowResident({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityFlowResident,
			mutation: 'setCityFlowResident',
			outFilter
		})
	},
	updateCityFlowWorker({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityFlowWorker,
			mutation: 'setCityFlowWorker',
			outFilter
		})
	},
	updateCityTotalPopulation({dispatch}){
		return dispatch('updateModel', {
			model: cityTotalPopulation,
			mutation: 'setCityTotalPopulation',
			noCache: true
		})
	},
	updateCountyTotalPopulation({dispatch}){
		return dispatch('updateModel', {
			model: countyTotalPopulation,
			mutation: 'setCountyTotalPopulation',
			noCache: true
		})
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};