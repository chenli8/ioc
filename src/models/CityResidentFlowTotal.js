import CityFlowTotal from './CityFlowTotal.js';
import {TABLE_CITY_FLOW_RESIDENT_COUNT} from './query/tableName.js';
/**
 * 常住人口流动页--城市常住人口概况
 */
export default class CityResidentFlowTotal extends CityFlowTotal {
	constructor(option){
		super(option);
		
		this._tableName = TABLE_CITY_FLOW_RESIDENT_COUNT;
		
		this._init();
	}
}