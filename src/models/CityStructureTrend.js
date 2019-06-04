import BaseModel from './BaseModel';
import {getCamelizeStrategies} from './util';
import {CITY_STRUCTURE_FILTER_STRATEGIES} from './filterStrategies';
import {CITY_STRUCTURE_STRATEGIES} from './strategies';
import {TABLE_CITY_STRUCTURE_TREND} from './query/tableName.js';
import {CITY_STRUCTURE } from './query';


/**
 * 城市人口来源本地，外来人口来源城市列表
 * TODO--目前数据库有问题
 */
export default class CityStructureTrend extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = CITY_STRUCTURE;
		this.strategies = getCamelizeStrategies(CITY_STRUCTURE_STRATEGIES);
		this.listParams = {};
		this._tableName = TABLE_CITY_STRUCTURE_TREND;
		this._filterStrategies = CITY_STRUCTURE_FILTER_STRATEGIES;

		this._init();
	}
}