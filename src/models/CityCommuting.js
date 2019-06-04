import BaseModel from './BaseModel.js';
import {TABLE_CITY_COMMUTING} from './query/tableName.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_COMMUTING_STRATEGIES} from './strategies';
import {CITY_COMMUTING_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 城市通勤分析
 */
export default class CityCommuting extends BaseModel {
	constructor(option){
		super(option);

		this._tableName = TABLE_CITY_COMMUTING;
		this.strategies = getCamelizeStrategies(CITY_COMMUTING_STRATEGIES);
		this._filterStrategies = CITY_COMMUTING_FILTER_STRATEGIES;

		this._init();
	}
}