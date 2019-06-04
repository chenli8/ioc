import BaseModel from './BaseModel';
import {getCamelizeStrategies} from './util';
import {CITY_SOURCE_LIST_FILTER_STRATEGIES} from './filterStrategies';
import {CITY_SOURCE_LIST_STRATEGIES} from './strategies';
import {TOP_30_PARAMS} from './query';

/**
 * 城市人口来源本地，外来人口来源城市列表
 * TODO--目前数据库有问题
 */
export default class CitySourceList extends BaseModel {
	constructor(option){
		super(option);
		
		this.strategies = getCamelizeStrategies(CITY_SOURCE_LIST_STRATEGIES);
		this._tableName = 'Td_view_city_household_sort';
		this.listParams = TOP_30_PARAMS;
		this._filterStrategies = CITY_SOURCE_LIST_FILTER_STRATEGIES;

		this._init();
	}
}