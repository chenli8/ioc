import BaseModel from './BaseModel.js';
import {getCamelizeStrategies, getFilterStrategies} from './util';
import {TD_DATA_STREET_HEATING_BASE} from './query/tableName.js';
import {STREET_HEAT_STRATEGIES} from './strategies';
import {STREET_HEAT,ALL_LIST_PARAMS} from './query';
import {STREET_WORK_HEAT_FILTER_STRATEGIES} from './filterStrategies';
/**
 * 城市通勤分析-工作人口的居住地街道热力
 */
export default class StreetWorkHeat extends BaseModel {
	constructor(option){
		super(option);
		
		this.query = STREET_HEAT;
		this.strategies = getCamelizeStrategies(STREET_HEAT_STRATEGIES,TD_DATA_STREET_HEATING_BASE);
		// this._tableName = TD_DATA_STREET_HEATING_BASE;
		this.listParams = ALL_LIST_PARAMS;
		this._filterStrategies = getFilterStrategies(STREET_WORK_HEAT_FILTER_STRATEGIES, TD_DATA_STREET_HEATING_BASE);
		this._init();
	}
}