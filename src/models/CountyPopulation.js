import BaseModel from './BaseModel.js';
import Population from './Population.js';
import {COUNTY_POPULATION, ALL_LIST_PARAMS} from './query';

export default class CountyPopulation extends BaseModel {
	constructor(option){
		super(option);

		this.query = COUNTY_POPULATION;
		this.listParams = ALL_LIST_PARAMS;

		this._filterStrategies = {
			cityName: '.Td_data_county_worklive_structure.p_city_name',
			cityCode: '.Td_data_county_worklive_structure.p_city_code',
			dateTime: '.Td_data_county_worklive_structure.date_time'
		}

		this._model = new Population();
		
		this._init();
	}

	/**
	 * overwrite updateValue of BaseModel
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	updateValue(data){
		let list = data['[]'] || [],
			value = this.value = list.map( item => this._model.convertDataByStrategies(item) );
		
		return value
	}
}