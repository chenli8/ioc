import CityFlowTotal from './CityFlowTotal.js';
import {TABLE_CITY_FLOW_WORKER_COUNT} from './query/tableName.js';
/**
 * 劳动力人口流动页--城市劳动力人口概况
 */
export default class CityWorkerFlowTotal extends CityFlowTotal {
	constructor(option){
		super(option);
		
		this._tableName = TABLE_CITY_FLOW_WORKER_COUNT;
		
		this._init();
	}
}