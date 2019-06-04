import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {COUNTY_WORK_STRATEGIES} from './strategies';
import {ALL_LIST_PARAMS, COUNTY_WORKLIVE} from './query';
import {COUNTY_WORK_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 区县职住分析-工作地分析
 */
export default class CountyWork extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = COUNTY_WORKLIVE;
		this._tableName = 'Td_flow_county_to_county_worklive';
		this.strategies = getCamelizeStrategies(COUNTY_WORK_STRATEGIES);
		this.listParams = ALL_LIST_PARAMS;
		
		this._filterStrategies = COUNTY_WORK_FILTER_STRATEGIES;

		this._init();
	}
}