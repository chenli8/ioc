import BaseModel from './BaseModel';
import {TOTAL_POPULATION_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 人口运行首页，区县总人口情况
 */
export default class CountyTotalPopulation extends BaseModel {
	constructor(option){
		super(option);
			
		this.url = '/districtTotal';
		
		this._filterStrategies = TOTAL_POPULATION_FILTER_STRATEGIES;
	}
}