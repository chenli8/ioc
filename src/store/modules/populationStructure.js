/**
 * 人口构成
 * 
 * @model CityStructureTrend 全市人口构成10年趋势
 * CityStructureTrend.cityCode                城市行政区划编码
 * CityStructureTrend.cityName                城市名称
 * CityStructureTrend.dateTime            数据时间版本
 * CityStructureTrend.femaleRate          性别构成女性占比
 * CityStructureTrend.maleRate            性别构成男性占比
 * CityStructureTrend.sexRate             性别构成性别比
 * CityStructureTrend.ruralRate  		  全市人口农村比重
 * CityStructureTrend.urbanRate           全市人口城镇比重
 *
 * @model CountyAgeStructure 区县人口性别构成
 * CountyAgeStructure.childrenRatio              区县儿童占比（0-14岁）
 * CountyAgeStructure.childrenDependencyRatio    区县少儿抚养比
 * CountyAgeStructure.labourRatio                区县成年人占比（15-64岁）
 * CountyAgeStructure.oldRatio                   区县老年人占比（65岁以上）
 * CountyAgeStructure.oldDependencyRatio         区县老年抚养比
 * CountyAgeStructure.totalDependencyRatio       区县总抚养比
 * 
 * @model CountySexStructure 区县人口性别构成
 * CountySexStructure.femaleRate                 区县性别构成女性占比
 * CountySexStructure.maleRate                   区县性别构成男性占比
 * 
 */

import {
	cityStructureTrend,
	countyAgeStructure,
	countySexStructure,
	countyStructure
} from '../../models/index';
import clone from 'clone';
const state = {
	init: false,
	cityStructureTrend: [], //城市性别、城镇人口10年趋势
	// countySource: [], 外来人口占比及排名，本地人口占比及排名，省内、省外外来人口占比及排名
	countyAgeStructure: [],  //区县年龄占比，抚养比
	countySexStructure: [],  //区县性别比例
	countyStructure: [],

};

const getters = {
	getRate(state, getters,store){
		//合并countyStructure、countySource
		const countySource=store.populationSource.countySource;
		let rate=clone(state.countyStructure);
		rate.forEach((item)=>{
			const obj=countySource.find((source)=>{
				return source.code===item.countyCode;
			});
			if(obj!==undefined){
				//本地人口占比
				item.localRate=obj.localRate||0;
				//外来人口占比
				item.inflowRate=obj.inflowRate||0;
				//省内外来占比
				item.inflowLocalRate=obj.inflowLocalRate||0;
				//省外外来占比
				item.inflowExternalRate=obj.inflowExternalRate||0;
			}else{
				item.localRate=0;
				item.inflowRate=0;
				item.inflowLocalRate=0;
				item.inflowExternalRate=0;
			}
		});
		return rate;
	},
	countyStructureItem({countyStructure}, getters, {cityInfo}){
		let {countyCode} = cityInfo || {},
			countyStructureItem = {};

		if(countyCode && countyStructure && countyStructure.length) countyStructureItem = countyStructure.find( _ => _.countyCode == countyCode)
	
		return countyStructureItem
	}
};

const mutations = {
	setPopulationStructureInit(state, init){
		state.init = init;
	},
	setCityStructureTrend(state, cityStructureTrend){
		state.cityStructureTrend = cityStructureTrend;
	},
	setCountyAgeStructure(state, countyAgeStructure){
		state.countyAgeStructure = countyAgeStructure;
	},
	setCountySexStructure(state, countySexStructure){
		state.countySexStructure = countySexStructure;
	},
	setCountyStructure(state, countyStructure){
		state.countyStructure = countyStructure;
	}
};

const actions = {
	updatePopulationStructure({ dispatch, commit }){
		return dispatch('updateActions', [
			'updateCityStructureTrend',
			'updateCountySource',
			'updateCountyStructureList'
		]).then( data => {
			commit('setPopulationStructureInit', true);
			return data
		})
	},
	updateCountyStructure({dispatch}){
		return dispatch('updateActions', [
			'updateCountyAgeStructure',
			'updateCountySexStructure'
		])
	},
	updateCountyStructureList({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyStructure,
			mutation: 'setCountyStructure', 
			outFilter
		})
	},
	updateCityStructureTrend({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: cityStructureTrend,
			mutation: 'setCityStructureTrend', 
			outFilter
		})
	},
	updateCountyAgeStructure({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countyAgeStructure,
			mutation: 'setCountyAgeStructure', 
			filterType: 'countyFilterWithoutDateTime',
			outFilter
		})
	},
	updateCountySexStructure({dispatch}, outFilter){
		return dispatch('updateModel', {
			model: countySexStructure,
			mutation: 'setCountySexStructure', 
			filterType: 'countyFilterWithoutDateTime',
			outFilter
		})
	},
};

export default {
	state,
	getters,
	mutations,
	actions
};