import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {SIMPLE_POPULATION_STRATEGIES} from './strategies';

export default class SimplePopulation extends BaseModel {
	constructor(option){
		super(option);

		this.strategies = getCamelizeStrategies(SIMPLE_POPULATION_STRATEGIES, 'Td_data_county_worklive_structure');

		this._init();
	}
	
}