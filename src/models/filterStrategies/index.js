import {TABLE_COUNTY_SEX_STRUCTURE, } from '../query/tableName.js';
/**
 * 人口流动
 * @type {Object}
 */
export const CITY_FLOW_FILTER_STRATEGIES = {
	cityName: ['.target_name', '.source_name!'],
	cityCode: ['.target_code', '.source_code!'],
	dateTime: '.date_time'
};
export const CITY_STRUCTURE_FILTER_STRATEGIES = {
	cityName: '.city_name',
	cityCode: '.city_code'
};
/**
 * --TODO--
 * @type {Object}
 */
export const CITY_FLOW_INDEX_FILTER_STRATEGIES = {
	dateTime: '.date_time',
	provinceCode: '.p_code',
	provinceName: '.p_name'
};

export const CITY_INFO_FILTER_STRATEGIES = {
	cityName: 'name',
	cityCode: 'code'
};

/**
 * 城市人口总量
 * @type {Object}
 */
export const CITY_POPULATION_FILTER_STRATEGIES = {
	cityName: '.city_name',
	cityCode: '.city_code',
	dateTime: '.date_time'
};

export const CITY_FILTER_STRATEGIES = {
	cityName: '.name',
	cityCode: '.code',
	dateTime: '.date_time'
};

export const CITY_SOURCE_LIST_FILTER_STRATEGIES = {
	cityName: '.target_name',
	cityCode: '.target_code',
	dateTime: '.date_time'
};

export const COUNTY_FILTER_STRATEGIES = {
	countyName: '.county_name',
	countyCode: '.county_code',
	dateTime: '.date_time'
};

export const COUNTY_WORK_FILTER_STRATEGIES = {
	countyName: ['.live_county_name', '.work_county_name!'],
	countyCode: ['.live_county_code', '.work_county_code!'],
	dateTime: '.date_time'
};

export const COUNTY_LIVE_FILTER_STRATEGIES = {
	countyName: ['.work_county_name', '.live_county_name!'],
	countyCode: ['.work_county_code', '.live_county_code!'],
	dateTime: '.date_time'
};

export const TOTAL_POPULATION_FILTER_STRATEGIES = {
	cityCode: 'citycode'
};

export const COUNTY_SOURCE_FILTER_STRATEGIES = {
	cityCode: '.p_code',
	cityName: '.p_name',
	dateTime: '.date_time'
}

export const CITY_COMMUTING_FILTER_STRATEGIES = CITY_POPULATION_FILTER_STRATEGIES;

export const COUNTY_COMMUTING_FILTER_STRATEGIES = COUNTY_SOURCE_FILTER_STRATEGIES;

export const STREET_COMMUTING_FILTER_STRATEGIES = CITY_POPULATION_FILTER_STRATEGIES;

export const COUNTY_FLOW_WORKLIVE_FILTER_STRATEGIES = {
	cityCode: '.p_city_code',
	cityName: '.p_city_name',
	dateTime: '.date_time'
}
export const COUNTY_STRUCTURE_FILTER_STRATEGIES = {
	cityName: `.${TABLE_COUNTY_SEX_STRUCTURE}.p_city_name`,
	cityCode: `.${TABLE_COUNTY_SEX_STRUCTURE}.p_city_code`
};
export const STREET_WORK_FILTER_STRATEGIES = {
	streetCode: ['.live_code', '.work_code!'],
	streetName: '.live_name',
	dateTime: '.date_time'
};
export const STREET_LIVE_FILTER_STRATEGIES = {
	streetCode: ['.work_code', '.live_code!'],
	streetName: '.work_name',
	dateTime: '.date_time'
}
export const STREET_WORK_HEAT_FILTER_STRATEGIES = {
	liveCode: '.live_code',
	dateTime: '.date_time'
}
