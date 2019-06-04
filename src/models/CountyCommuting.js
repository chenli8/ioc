import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {TABLE_COUNTY_COMMUTING} from './query/tableName.js';
import {ALL_LIST_PARAMS, COMMUTING} from './query/index.js';
import {COUNTY_COMMUTING_STRATEGIES} from './strategies';
import {COUNTY_COMMUTING_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 区县通勤分析
 */
export default class CountyCommuting extends BaseModel {
	constructor(option){
		super(option);

		this.query = COMMUTING;
		this._tableName = TABLE_COUNTY_COMMUTING;
		this.listParams = ALL_LIST_PARAMS;
		this.strategies = getCamelizeStrategies(COUNTY_COMMUTING_STRATEGIES);
		this._filterStrategies = COUNTY_COMMUTING_FILTER_STRATEGIES;

		this._init();
	}
}