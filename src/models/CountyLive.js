import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {COUNTY_LIVE_STRATEGIES} from './strategies';
import {ALL_LIST_PARAMS, COUNTY_WORKLIVE} from './query';
import {COUNTY_LIVE_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 区县职住分析-工作地分析
 */
export default class CountyLive extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = COUNTY_WORKLIVE;
		this._tableName = 'Td_flow_county_to_county_worklive';
		this.strategies = getCamelizeStrategies(COUNTY_LIVE_STRATEGIES);
		this.listParams = ALL_LIST_PARAMS;
		
		this._filterStrategies = COUNTY_LIVE_FILTER_STRATEGIES;

		this._init();
	}
}