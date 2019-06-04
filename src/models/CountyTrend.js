import BaseModel from './BaseModel.js';
import SimplePopulation from './SimplePopulation';
import {COUNTY_TREND, TREND_LIST_PARAMS} from './query';

/**
 * 区县12个月人口总量，常住人口，居住人口等趋势
 */
export default class CountyTrend extends BaseModel {
	constructor(option){
		super(option);

		this.query = COUNTY_TREND;
		this.listParams = TREND_LIST_PARAMS;

		this._filterStrategies = {
			countyName: '.Td_data_county_worklive_structure.county_name',
			countyCode: '.Td_data_county_worklive_structure.county_code',
			dateTime: '.Td_data_county_worklive_structure.date_time<='
		}

		this._model = new SimplePopulation();
		
		this._init();
	}

	/**
	 * overwrite updateValue of BaseModel
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	updateValue(data){
		let { _tableName } = this,
			list = data['[]'] || [],
			value = this.value = list.map( item => this._model.convertDataByStrategies(item) );
		
		return value
	}
}