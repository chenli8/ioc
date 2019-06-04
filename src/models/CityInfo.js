import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {CITY_INFO_STRATEGIES} from './strategies';
import {CITY_INFO} from './query';
import {CITY_INFO_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 城市人口流动分析
 */
export default class CityInfo extends BaseModel {
	constructor(option){
		super(option);
			
		this.query = CITY_INFO;
		this.strategies = getCamelizeStrategies(CITY_INFO_STRATEGIES);
		
		this._filterStrategies = getFilterStrategies(CITY_INFO_FILTER_STRATEGIES, 'Td_config_administrative_district');
	}
}