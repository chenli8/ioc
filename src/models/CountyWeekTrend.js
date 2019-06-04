import BaseModel from './BaseModel.js';
import {getCamelizeStrategies} from './util';
import {COUNTY_WEEK_TREND, TREND_LIST_PARAMS} from './query';
import {COUNTY_WEEK_TREND_STRATEGIES} from './strategies';

/**
 * 区县周人口趋势
 */
export default class CountyWeekTrend extends BaseModel {
	constructor(option){
		super(option);

		this.query = COUNTY_WEEK_TREND;
		this.strategies = getCamelizeStrategies(COUNTY_WEEK_TREND_STRATEGIES);
		this._tableName = 'Td_data_county_week_population';
		this.listParams = TREND_LIST_PARAMS;

		this._filterStrategies = {
			countyName: '.county_name',
			countyCode: '.county_code',
			dayEnd: '.day_end<='
		}

		this._init();
	}
}