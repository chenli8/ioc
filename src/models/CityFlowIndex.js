import BaseModel from './BaseModel.js';
import {ALL_LIST_PARAMS, CITY_FLOW_INDEX} from './query';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_FLOW_INDEX_STRATEGIES} from './strategies';
import {CITY_FLOW_INDEX_FILTER_STRATEGIES} from './filterStrategies';

/**
 * 城市人口流动指数排名 -- 劳动力人口流动指数和常住人口流动指数父类
 */
export default class CityFlowIndex extends BaseModel {
	constructor(option){
		super(option);
			
		this.query = CITY_FLOW_INDEX;
		this.strategies = getCamelizeStrategies(CITY_FLOW_INDEX_STRATEGIES);
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(CITY_FLOW_INDEX_FILTER_STRATEGIES);
	}
}