/**
 * 各页面公用的filter
 * @type {Object}
 */

import {getMonthList} from '../../lib/util.js';
import {cityInfo} from '../../models';

const state = {
	isInit: false,
	provinceCode: 0,
	provinceName: '',
	cityCode: 0,
	cityName: '',
	countyCode: 0,
	countyName: '',
	streetCode: '450502001000',
	streetName: '',
	dateTime: '', //最新数据日期
	dayEnd: '',
	childrenNum: 0, //子行政区域数量(市下面有多少区县)
	siblingsNum: 0, //兄弟行政区域数量(省下面有多少市)
	cityFencing: '',
	countyFencing: '',
	streetFencing: '',
	center: ''
};

const getters = {
	filter({
		dateTime,
		cityCode
	}){
		return {
			cityCode,
			dateTime
		}
	},
	countyTrendFilter({
		dayEnd,
		countyCode
	}){
		return {
			countyCode,
			// dayEnd
		}
	},
	provinceFilter({
		dateTime,
		provinceCode
	}){
		return {
			dateTime,
			provinceCode
		}
	},
	countyFilter({
		dateTime,
		countyCode
	}){
		return {
			countyCode,
			dateTime
		}
	},
	streetFilter({
		dateTime,
		streetCode
	}){
		return {
			dateTime,
			streetCode
		}
	},
	countyFilterWithoutDateTime({countyCode}){
		return {
			countyCode
		}
	},
	dateTimeList({
		dateTime
	}){
		let monthList = getMonthList(dateTime, {descFormat: 'yyyy-MM'}) || [];
		
		return monthList.reverse()
	},
	getCityFencing({
		cityFencing
	}){
		return cityFencing && Object.freeze(JSON.parse(cityFencing))
	},
	getCountyFencing({
		countyFencing
	}){
		return countyFencing && Object.freeze(JSON.parse(countyFencing))
	},
	getCountyCenter({
		center
	}){
		return center && Object.freeze(JSON.parse(center))
	},
	getStreetCenter({
		streetFencing
	}){
		return streetFencing && Object.freeze(JSON.parse(streetFencing))
	}
};

const mutations = {
	setInit(state, isInit){
		state.isInit = isInit;
	},
	setCounty(state, {countyCode, countyName}){
		state.countyCode = countyCode;
		state.countyName = countyName;
	},
	setStreet(state, {countyCode, countyName, streetCode, streetName}){
		countyCode && countyName && this.commit('setCounty', {countyCode, countyName});
		state.streetCode = streetCode;
		state.streetName = streetName;
	},
	setDateTime(state, dateTime){
		state.dateTime = dateTime;
	},
	setDayEnd(state, dayEnd){
		state.dayEnd = dayEnd;
	},
	setCityInfo(state, cityInfo){
		let keyList = [
			'cityCode',
			'cityName',
			'provinceCode',
			'provinceName',
			'dateTime',
			'childrenNum',
			'siblingsNum',
			'cityFencing',
			'countyFencing',
			'streetFencing',
			'center'
		];

		keyList.forEach( key => {
			let value = cityInfo[key];

			value && (state[key] = value);
		});
	}
};

const actions = {
	updateCityInfo({dispatch, commit}, cityCode){
		if(!cityCode) return Promise.reject('cityCode不能为空！')

		return dispatch('updateModel', {
			model: cityInfo,
			mutation: 'setCityInfo',
			filterType: '',
			outFilter: {cityCode}
		}).then( cityInfo => {
			commit('setInit', true);
			return cityInfo
		})
	}
};

export default {
	state,
	getters,
	mutations,
	actions
};