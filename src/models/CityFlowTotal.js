import BaseModel from './BaseModel.js';
import {CITY_RESIDENT_FLOW_IN_AND_OUT, ALL_LIST_PARAMS} from './query';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_FLOW_TOLAL_STRATEGIES} from './strategies';
import {CITY_FILTER_STRATEGIES} from './filterStrategies';

/**
 * 人口流动页--城市常住人口/劳动力人口流动概况父类
 */
export default class CityFlowTotal extends BaseModel {
	constructor(option){
		super(option);
		
		this.strategies = getCamelizeStrategies(CITY_FLOW_TOLAL_STRATEGIES);
		this._filterStrategies = getFilterStrategies(CITY_FILTER_STRATEGIES);
	}
}