import BaseModel from './BaseModel.js';
import {CITY_WORKER_FLOW_IN_AND_OUT, ALL_LIST_PARAMS} from './query';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_FLOW_WORKER_IN_AND_OUT_STRATEGIES} from './strategies';
import {CITY_FLOW_FILTER_STRATEGIES} from './filterStrategies';
import {TABLE_CITY_FLOW_WORKER} from './query/tableName.js';
/**
 * 城市常住人口流入流出，以及净流入列表
 */
export default class CityWorkerFlowInAndOut extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = CITY_WORKER_FLOW_IN_AND_OUT;
		this.strategies = getCamelizeStrategies(CITY_FLOW_WORKER_IN_AND_OUT_STRATEGIES, TABLE_CITY_FLOW_WORKER);
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(CITY_FLOW_FILTER_STRATEGIES, TABLE_CITY_FLOW_WORKER);
		
		this._init();
	}
}