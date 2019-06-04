import BaseModel from './BaseModel';
import {TOTAL_POPULATION_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 城市人口流动分析
 */
export default class CityTotalPopulation extends BaseModel {
	constructor(option){
		super(option);
			
		this.url = '/cityTotal';
		
		this._filterStrategies = TOTAL_POPULATION_FILTER_STRATEGIES;
	}
}