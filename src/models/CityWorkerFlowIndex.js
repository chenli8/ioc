import CityFlowIndex from './CityFlowIndex.js';
import {TABLE_CITY_FLOW_WORKER_COUNT} from './query/tableName.js';

/**
 * 城市劳动力人口流动指数排名
 */
export default class CityWorkerFlowIndex extends CityFlowIndex {
	constructor(option){
		super(option);
			
		this._tableName = TABLE_CITY_FLOW_WORKER_COUNT;
		
		this._init();
	}
}