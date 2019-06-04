import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {COUNTY_SEX_STRATEGIES} from './strategies';
import {COUNTY_FILTER_STRATEGIES} from './filterStrategies';
import {COUNTY_STRUCTURE} from './query';
import {TABLE_COUNTY_SEX_STRUCTURE} from './query/tableName.js';

export default class CountySexStructure extends BaseModel {
	constructor(option){
		super(option);

		this.query = COUNTY_STRUCTURE;
		this.strategies = getCamelizeStrategies(COUNTY_SEX_STRATEGIES);
		this._tableName = TABLE_COUNTY_SEX_STRUCTURE;
		this._filterStrategies = COUNTY_FILTER_STRATEGIES;

		this._init();
	}
}