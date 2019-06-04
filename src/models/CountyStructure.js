import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {COUNTY_STRUCTURE_STRATEGIES} from './strategies';
import {COUNTY_STRUCTURE_FILTER_STRATEGIES} from './filterStrategies';
import {CITY_STRUCTURE_LIST, ALL_LIST_PARAMS} from './query';

export default class CountyStructure extends BaseModel {
	constructor(option){
		super(option);

		this.query = CITY_STRUCTURE_LIST;
		this.strategies = COUNTY_STRUCTURE_STRATEGIES;
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = COUNTY_STRUCTURE_FILTER_STRATEGIES;

		this._init();
	}
}