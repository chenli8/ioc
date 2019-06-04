import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {STREET_COUNTY_COMMUTING} from './query/tableName.js';
import {ALL_LIST_PARAMS, STREET_COMMUTING} from './query/index.js';
import {STREET_COMMUTING_STRATEGIES} from './strategies';
import {STREET_COMMUTING_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 区县通勤分析
 */
export default class StreetCommuting extends BaseModel {
	constructor(option){
		super(option);

		this.query = STREET_COMMUTING;
		this._tableName = STREET_COUNTY_COMMUTING;
		this.listParams = ALL_LIST_PARAMS;
		this.strategies = getCamelizeStrategies(STREET_COMMUTING_STRATEGIES);
		this._filterStrategies = STREET_COMMUTING_FILTER_STRATEGIES;

		this._init();
	}
}