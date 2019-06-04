import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {ALL_LIST_PARAMS, COUNTY_FLOW_WORKLIVE} from './query';
import {COUNTY_FLOW_WORKLIVE_FILTER_STRATEGIES} from './filterStrategies';
import {TABLE_COUNTY_WORKLIVE_COUNT} from './query/tableName.js';
import {COUNTY_FLOW_WORKLIVE_STRATEGIES} from './strategies';

/**
 * 跨区人口职住，区县跨区人口职住
 */
export default class CountyFlowWorkLive extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = COUNTY_FLOW_WORKLIVE;
		this.strategies = getCamelizeStrategies(COUNTY_FLOW_WORKLIVE_STRATEGIES);
		this.listParams = ALL_LIST_PARAMS;
		this._tableName = TABLE_COUNTY_WORKLIVE_COUNT;
		this._filterStrategies = COUNTY_FLOW_WORKLIVE_FILTER_STRATEGIES;
		
		this._init();
	}
}