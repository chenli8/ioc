import BaseModel from './BaseModel.js';
import {CITY_RESIDENT_FLOW, FLOW_LIST_PARAMS} from './query';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_FLOW_RESIDENT_STRATEGIES} from './strategies';
import {CITY_FLOW_FILTER_STRATEGIES} from './filterStrategies';
import {TABLE_CITY_FLOW_RESIDENT} from './query/tableName.js';
/**
 * 城市常住人口流动分析
 */
export default class CityFlowResident extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = CITY_RESIDENT_FLOW;
		this.strategies = getCamelizeStrategies(CITY_FLOW_RESIDENT_STRATEGIES, TABLE_CITY_FLOW_RESIDENT);
		this.listParams = FLOW_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(CITY_FLOW_FILTER_STRATEGIES, TABLE_CITY_FLOW_RESIDENT);
		
		this._init();
	}
}