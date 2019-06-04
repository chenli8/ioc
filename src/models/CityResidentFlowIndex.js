import CityFlowIndex from './CityFlowIndex.js';
import {TABLE_CITY_FLOW_RESIDENT_COUNT} from './query/tableName.js';

/**
 * 城市常住人口流动指数排名
 */
export default class CityResidentFlowIndex extends CityFlowIndex {
	constructor(option){
		super(option);
			
		this._tableName = TABLE_CITY_FLOW_RESIDENT_COUNT;
		
		this._init();
	}
}