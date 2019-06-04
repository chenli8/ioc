import BaseModel from './BaseModel';
import {getCamelizeStrategies} from './util';
import {COUNTY_SOURCE_FILTER_STRATEGIES} from './filterStrategies';
import {COUNTY_SOURCE_STRATEGIES} from './strategies';
import {ALL_LIST_PARAMS, COUNTY_SOURCE} from './query';
import {TABLE_COUNTY_SOURCE_COUNT} from './query/tableName.js';

/**
 * 各区县跨区人口流动
 */
export default class CountySource extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = COUNTY_SOURCE;
		this.strategies = getCamelizeStrategies(COUNTY_SOURCE_STRATEGIES);
		this._tableName = TABLE_COUNTY_SOURCE_COUNT;
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = COUNTY_SOURCE_FILTER_STRATEGIES;

		this._init();
	}
}