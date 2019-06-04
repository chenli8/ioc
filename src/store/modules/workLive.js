/**
 * 人口跨区职住
 *
 * @model CountyWork/CountyLive 区县工作人口/居住人口流入详情
 * model.countyCode             区县行政区划编码
 * model.countyName 			区县名称
 * model.dateTime  				数据时间版本
 * model.population             工作人口/居住人口流入人口数量
 * model.rate 					工作人口/居住人口流入人口占比
 * model.totalPopulation 		工作人口/居住人口总流入人口数量
 * model.workCountyCode			工作区县行政区划编码
 * model.workCountyName			工作区县名称
 * model.liveCountyCode			居住区县行政区划编码
 * model.liveCountyName			居住区县名称
 * 
 * @model CountyFlowWorkLive                   区县工作居住人口流入汇总
 * CountyFlowWorkLive.cityCode                 所属城市行政区划编码
 * CountyFlowWorkLive.cityName                 所属城市名称
 * CountyFlowWorkLive.countyCode               区县行政区划编码
 * CountyFlowWorkLive.countyName               区县名称
 * CountyFlowWorkLive.dateTime                 数据时间版本
 * CountyFlowWorkLive.liveInflowPopulation     居住人口流入总量
 * CountyFlowWorkLive.liveInflowSort           居住人口流入排名
 * CountyFlowWorkLive.workInflowPopulation     工作人口流入总量
 * CountyFlowWorkLive.workInflowSort           工作人口流入排名
 */

import {
	countyWork,
	countyLive,
	countyFlowWorkLive,
} from '../../models/index';

const state = {
	init: false,
	// countyPopulation: [], //各区县工作，居住人口列表，到totalPopulation模块中获取
	// cityPopulation: {}, //城市工作，居住人口情况，到totalPopulation模块中获取
	countyWork: [],//去哪里工作
	countyLive: [],//去哪里居住
	countyFlowWorkLiveType: 1,//工作人口1|居住人口2
	countyFlowWorkLive: [] // 区县跨区职住
};

const getters = {

};

const mutations = {
	setWorkerLiveInit(state, init){
		state.init = init;
	},
	setCountyWork(state, countyWork){
		state.countyWork = countyWork;
	},
	setCountyLive(state, countyLive){
		state.countyLive = countyLive;
	},
	setCountyFlowWorkLive(state, countyFlowWorkLive){
		state.countyFlowWorkLive = countyFlowWorkLive;
	},
	setCountyFlowWorkLiveType(state, countyFlowWorkLiveType){
		state.countyFlowWorkLiveType = countyFlowWorkLiveType;
	}
};

const actions = {
	updateWorkLive({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityAndCountyPopulation',
			'updateCountyFlowWorkLive'
		]).then( data => {
			commit('setWorkerLiveInit', true);
			return data
		})
	},
	updateCountyWorkLive({ dispatch }){
		return dispatch('updateActions', [
			'updateCountyWork',
			'updateCountyLive'
		])
	},
	updateCountyWork({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyWork,
			mutation: 'setCountyWork', 
			filterType: 'countyFilter',
			outFilter
		})
	},
	updateCountyLive({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyLive,
			mutation: 'setCountyLive', 
			filterType: 'countyFilter',
			outFilter
		})
	},
	updateCountyFlowWorkLive({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyFlowWorkLive,
			mutation: 'setCountyFlowWorkLive', 
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