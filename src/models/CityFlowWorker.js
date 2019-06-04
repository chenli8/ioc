import BaseModel from './BaseModel.js';
import {CITY_WORKER_FLOW, FLOW_LIST_PARAMS} from './query';
import {TABLE_CITY_FLOW_WORKER} from './query/tableName.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_FLOW_WORKER_STRATEGIES} from './strategies';
import {CITY_FLOW_FILTER_STRATEGIES} from './filterStrategies';

/**
 * 城市常住人口流动分析
 */
export default class CityFlowWorker extends BaseModel {
	constructor(option){
		super(option);
			
		this.query = CITY_WORKER_FLOW;
		this.strategies = getCamelizeStrategies(CITY_FLOW_WORKER_STRATEGIES, TABLE_CITY_FLOW_WORKER);
		this.listParams = FLOW_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(CITY_FLOW_FILTER_STRATEGIES, TABLE_CITY_FLOW_WORKER);

		this._init();
	}
}