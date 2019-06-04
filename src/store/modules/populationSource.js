/**
 * 人口来源地
 *
 * @model CityPopulationSource 全市人口来源，汇总
 * CityPopulationSource.code                城市行政区划编码
 * CityPopulationSource.name                城市名称
 * CityPopulationSource.dateTime            数据时间版本
 * CityPopulationSource.inflowRate          城市外来人口占比
 * CityPopulationSource.localRate           城市本地人口占比
 * CityPopulationSource.inflowExternalRate  城市省外外来人口占比
 * CityPopulationSource.inflowLocalRate     城市省内外来人口占比
 *
 * @model citySourceList 全市外来人口列表
 * citySourceList.cityCode                  城市行政区划编码
 * citySourceList.cityName                  城市名称
 * citySourceList.sourceCode                外来人口来源城市行政区划编码
 * citySourceList.sourceName                外来人口来源城市名称
 * citySourceList.dateTime                  数据时间版本
 * citySourceList.inflowRate                该来源城市外来人口占比
 *
 * @model countySource 所属区县外来人口情况汇总
 * countySource.code                        区县行政区划编码
 * countySource.name                        区县名称
 * countySource.name                        区县名称
 * countySource.inflowRate                  区县外来人口占比
 * countySource.inflowRanking               区县外来人口占比排名
 * countySource.inflowExternalRate          区县省外外来人口占比
 * countySource.inflowExternalRanking       区县省外外来人口占比排名
 *
 */

import {
	cityPopulationSource,
	citySourceList,
	countySource
} from '../../models/index';

const state = {
	init: false,
	cityPopulationSource: {}, // 城市人口来源分析，本地，外来
	citySourceList: [], //城市人口来源分析-外来人口列表
	countySource: []  //该城市所属区县人口来源情况
};

const getters = {
	citySourceListTopTen({
		citySourceList
	}){
		return citySourceList.slice(0, 10)
	}
};

const mutations = {
	setSourceInit(state, init){
		state.init = init;
	},
	setCityPopulationSource(state, cityPopulationSource){
		state.cityPopulationSource = cityPopulationSource;
	},
	/**
	 * 人口来源页面取30个，概览也需要前十，通过getters.citySourceListTopTen获取
	 * @param {[type]} state          [description]
	 * @param {[type]} citySourceList [description]
	 */
	setCitySourceList(state, citySourceList){
		state.citySourceList = citySourceList;
	},
	setCountySource(state, countySource){
		state.countySource = countySource;
	}
};

const actions = {
	updateSourceAndList({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityPopulationSource',
			'updateCitySourceList'
		]).then( data => {
			commit('setSourceInit', true);
			return data
		})
	},
	updatePopulationSource({ dispatch }){
		return dispatch('updateActions', [
			'updateSourceAndList',
			'updateCountySource'
		])
	},
	updateCityPopulationSource({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: cityPopulationSource,
			mutation: 'setCityPopulationSource',
			outFilter
		})
	},
	updateCitySourceList({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: citySourceList,
			mutation: 'setCitySourceList',
			outFilter
		})
	},
	updateCountySource({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countySource,
			mutation: 'setCountySource',
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