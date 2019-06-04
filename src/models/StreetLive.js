import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {TABLE_STREET_WORKLIVE} from './query/tableName.js';
import {STREET_LIVE_STRATEGIES} from './strategies';
import {ALL_LIST_PARAMS, STREET_LIVE} from './query';
import {STREET_LIVE_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 区县职住分析-工作地分析
 */
export default class StreetLive extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = STREET_LIVE;
		this.strategies = getCamelizeStrategies(STREET_LIVE_STRATEGIES, TABLE_STREET_WORKLIVE);
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(STREET_LIVE_FILTER_STRATEGIES, TABLE_STREET_WORKLIVE);

		this._init();
	}
}