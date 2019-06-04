import BaseModel from './BaseModel';
import {getCamelizeStrategies} from './util';
import {CITY_FILTER_STRATEGIES} from './filterStrategies';
import {CITY_SOURCE_STRATEGIES} from './strategies';

/**
 * 城市人口来源本地，外来
 */
export default class CityPopulationSource extends BaseModel {
	constructor(option){
		super(option);
		
		this.strategies = getCamelizeStrategies(CITY_SOURCE_STRATEGIES);
		this._tableName = 'Td_view_city_household_count';
		this._filterStrategies = CITY_FILTER_STRATEGIES;

		this._init();
	}
}