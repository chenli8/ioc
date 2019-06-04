/**
 * 人口总量
 * 
 * @filter 为城市人口模型CityPopulationModel和区县人口模型CountyPopulationModel公用的filter
 * filter.cityName  城市名称，例如滨州市
 * filter.cityCode  城市编码，例如371600
 * filter.dateTime  数据版本，例如2018-12
 *
 * @PopulationModel分为城市人口模型CityPopulationModel和区县人口模型CountyPopulationModel，区县人口模型是一个列表，[CountyPopulationModel]
 * PopulationModel.countyCode           区县人口模型特有，区县代码
 * PopulationModel.countyName           区县人口模型特有，区县名称
 * PopulationModel.functionCode         区县人口模型特有，区县功能代码，例如1代表城区，2代表郊区，code从小到大代表其顺序
 * PopulationModel.functionName         区县人口模型特有，区县功能名称，示例同functionCode
 * PopulationModel.livePopulation       居住人口数
 * PopulationModel.residentPopulation   常住人口数
 * PopulationModel.workPopulation       工作人口数
 * PopulationModel.populationDensity    人口密度
 * PopulationModel.chainRatio           常住人口环比增长
 * PopulationModel.workLiveRatio        职住比
 *
 * @countyTrend 区县人口趋势
 */


import {
	countyPopulation,
	cityPopulation,
	countyTrend
} from '../../models/index';
import clone from 'clone';

const getSortedMapByKey = (population, key) => {
	let arr = population.map( item => {
		return {
				countyCode: item.countyCode,
				[key]: item[key]
			}
	}),
	map = {};

	arr.sort( (a, b) => a[key] - b[key]);

	arr.forEach( (item, index) => {
		let {countyCode } = item;

		if(!map[countyCode]){
			map[countyCode] = index + 1;
		}
	});

	return map
}

const state = {
	init: false,
	cityPopulation: {},  //城市人口
	countyPopulation: [], //对应区县人口
	countyTrend: [],       //对应区县人口12个月趋势
};

const getters = {
	/**
	 * 为countyPopulation加上工作人口、居住人口和职住比排名，并且按职住比排序
	 * @return {[type]} [description]
	 */
	countyPopulationSorted({countyPopulation}){
		let workMap = getSortedMapByKey(countyPopulation, 'workPopulation'),
			liveMap = getSortedMapByKey(countyPopulation, 'livePopulation'),
			countyPopulationSorted = clone(countyPopulation);

		countyPopulationSorted.sort( (a, b) => b.workLiveRatio - a.workLiveRatio );

		countyPopulationSorted.forEach( (item, index) => {
			let {countyCode} = item;

			item.workLiveRatioSort = index + 1;
			item.workPopulationSort = workMap[countyCode];
			item.livePopulationSort = liveMap[countyCode];
		});
		return countyPopulationSorted
	}
};

const mutations = {
	setTotalPopulationInit(state, init){
		state.init = init;
	},
	setCityPopulation(state, cityPopulation){
		state.cityPopulation = cityPopulation;
	},
	setCountyPopulation(state, countyPopulation){
		state.countyPopulation = countyPopulation;
	},
	setCountyTrend(state, countyTrend){
		state.countyTrend = countyTrend;
	}
};

const actions = {
	updateTotalPopulation({ dispatch, commit  }){
		return dispatch('updateActions', [
			'updateCityAndCountyPopulation',
			'updateCountyTrend'
		]).then( data => {
			commit('setTotalPopulationInit', true);
			return data
		})
	},
	updateCityAndCountyPopulation({dispatch}){
		return dispatch('updateActions', [
			'updateCityPopulation',
			'updateCountyPopulation'
		])
	},
	updateCityPopulation({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: cityPopulation,
			mutation: 'setCityPopulation',
			outFilter
		})
	},
	updateCountyPopulation({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: countyPopulation,
			mutation: 'setCountyPopulation',
			outFilter
		})
	},
	updateCountyTrend({ dispatch }, outFilter){
		return dispatch('updateModel', {
			model: countyTrend,
			mutation: 'setCountyTrend',
			filterType: 'countyFilter',
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