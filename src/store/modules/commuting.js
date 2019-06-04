/**
 * 城市通勤
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
	countyCommuting,
	cityCommuting,
	streetCommuting,
	streetWork,
	streetLive,
	streetWorkHeat
} from '../../models/index';

const state = {
	init: false,
	countyCommuting: [], //区县通勤列表
	cityCommuting: {}, //城市通勤情况
	streetCommuting: [],
	streetWork: [],
	streetLive: [],
	streetWorkHeat:[]
};

const getters = {
	countyCommutingItem({countyCommuting}, getters, {cityInfo: {countyCode}}){
		return countyCommuting.find( item => item.code == countyCode ) || {};
	},
	streetCommutingItem({streetCommuting}, getters, {cityInfo: {streetCode}}){
		return streetCommuting.find( item => item.code == streetCode ) || {};
	},
	streetCommutingOfCounty({streetCommuting}, getters, {cityInfo: {countyCode}}){
		let commuting = streetCommuting.filter( item => item.countyCode == countyCode );
		return commuting
	},
	streetWorkHeatFilter({},getters,{cityInfo: {streetCode,dateTime}}){
		return {
			liveCode:streetCode,
			dateTime
		}
	}
};

const mutations = {
	setCommutingInit(state, init){
		state.init = init;
	},
	setCountyCommuting(state, countyCommuting){
		state.countyCommuting = countyCommuting;
	},
	setCityCommuting(state, cityCommuting){
		state.cityCommuting = cityCommuting;
	},
	setStreetCommuting(state, streetCommuting){
		state.streetCommuting = streetCommuting;
	},
	setStreetWork(state, streetWork){
		state.streetWork = streetWork;
	},
	setStreetLive(state, streetLive){
		state.streetLive = streetLive;
	},
	setstreetWorkHeat(state, streetHead){
		state.streetHead = streetHead;
	}
};

const actions = {
	/**
	 * 
	 * @param  {[type]} options.dispatch [description]
	 * @return {[type]}                  [description]
	 */
	updateCommuting({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityCommuting',
			'updateCountyCommuting',
			'updateStreetCommuting',
			'updateStreetWork',
			'updateStreetLive'
		]).then( data => {
			commit('setOverviewInit', true);
			return data
		})
	},
	updateCountyCommuting({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyCommuting,
			mutation: 'setCountyCommuting',
			outFilter
		})
	},
	updateCityCommuting({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: cityCommuting,
			mutation: 'setCityCommuting',
			outFilter
		})
	},
	updateStreetCommuting({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: streetCommuting,
			mutation: 'setStreetCommuting',
			outFilter
		})
	},
	updateStreetWork({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: streetWork,
			mutation: 'setStreetWork',
			filterType: 'streetFilter',
			outFilter
		})
	},
	updateStreetLive({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: streetLive,
			mutation: 'setStreetLive',
			filterType: 'streetFilter',
			outFilter
		})
	},
	updateStreetWorkHeat({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: streetWorkHeat,
			mutation: 'setstreetWorkHeat',
			filterType: 'streetWorkHeatFilter',
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