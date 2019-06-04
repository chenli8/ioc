import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {CITY_POPULATION_STRATEGIES} from './strategies';
import {CITY_POPULATION_FILTER_STRATEGIES} from './filterStrategies';

export default class CityPopulation extends BaseModel {
	constructor(option){
		super(option);
		
		this.strategies = getCamelizeStrategies(CITY_POPULATION_STRATEGIES);

		this._tableName = 'Td_view_city_count';

		this._filterStrategies = CITY_POPULATION_FILTER_STRATEGIES;

		this._init();
	}
}