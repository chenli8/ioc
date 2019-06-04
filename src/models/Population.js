import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {POPULATION_STRATEGIES} from './strategies';

export default class Population extends BaseModel {
	constructor(option){
		super(option);

		this.strategies = getCamelizeStrategies(POPULATION_STRATEGIES, 'Td_data_county_worklive_structure');

		this._init();
	}
	
}