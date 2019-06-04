import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {TABLE_STREET_WORKLIVE} from './query/tableName.js';
import {STREET_WORK_STRATEGIES} from './strategies';
import {ALL_LIST_PARAMS, STREET_WORK} from './query';
import {STREET_WORK_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 街道职住分析-工作地分析
 */
export default class StreetWork extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = STREET_WORK;
		this.strategies = getCamelizeStrategies(STREET_WORK_STRATEGIES, TABLE_STREET_WORKLIVE);
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(STREET_WORK_FILTER_STRATEGIES, TABLE_STREET_WORKLIVE);
		
		this._init();
	}
}