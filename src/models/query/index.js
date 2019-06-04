import {
	TABLE_CITY_FLOW_RESIDENT, 
	TABLE_CITY_FLOW_WORKER,
	TABLE_COUNTY_SEX_STRUCTURE,
	TABLE_COUNTY_AGE_STRUCTURE,
	TABLE_STREET_WORKLIVE,
	TABLE_STREET_WORKLIVE_COUNT
} from './tableName.js';

export const ALL_LIST_PARAMS = {
	'count': 0
};

export const TOP_30_PARAMS = {
	'count': 30
};

export const COUNTY_POPULATION = {
	'Td_data_county_worklive_structure': {
		'@order': 'resident_population-'
	},
	'Td_config_administrative_district': {
		'code@': '/Td_data_county_worklive_structure/county_code'
	},
	'Td_view_county_rate': {
		'county_code@': '/Td_data_county_worklive_structure/county_code',
		'date_time@': '/Td_data_county_worklive_structure/date_time'
	}
};
/**
 * 首页常住人口，劳动力人口列表参数
 * @type {Object}
 */
export const FLOW_LIST_PARAMS = {
	'count': 30
}
export const TREND_LIST_PARAMS = {
	'count': 12
}

export const COUNTY_TREND = {
	'Td_data_county_worklive_structure': {
		'@order': 'date_time-'
	},
	'Td_view_county_rate': {
		'county_code@': '/Td_data_county_worklive_structure/county_code',
		'date_time@': '/Td_data_county_worklive_structure/date_time'
	}
};

export const COUNTY_WORKLIVE = {
	'@order': 'population-'
}

export const COUNTY_WEEK_TREND = {
	'@order': 'day_end-'
}

export const CITY_FLOW = {
	'@order': 'population-'
}
export const CITY_STRUCTURE = {
	'@order': 'date_time-'
}
export const COUNTY_STRUCTURE = {
	'@order': 'date_time-'
}

export const COUNTY_SOURCE = {
	'@order': 'inflow_ranking+'
}

export const COMMUTING = {
	'@order': 'commuter_distance_rank+'
}

export const STREET_COMMUTING = {
	'@order': 'average_distance-'
}

export const CITY_INFO = {
	'Td_config_administrative_district': {
		Td_config_administrative_district: {
			'code@': '/p_code'
		}
	},
	'Td_config_showdata_monthly': {
		'city_code@': '/Td_config_administrative_district/code'
	},
	'Td_config_city_geo_fencing': {
		'city_code@': '/Td_config_administrative_district/code'
	}
}

export const CITY_RESIDENT_FLOW = {
	[TABLE_CITY_FLOW_RESIDENT]: {
		...CITY_FLOW
	},
	'Td_view_city_people_count': {
		'code@': `/${TABLE_CITY_FLOW_RESIDENT}/target_code`,
		'date_time@': `/${TABLE_CITY_FLOW_RESIDENT}/date_time`
	}
}

export const CITY_WORKER_FLOW = {
	[TABLE_CITY_FLOW_WORKER]: {
		...CITY_FLOW
	},
	'Td_view_city_worker_count': {
		'code@': `/${TABLE_CITY_FLOW_WORKER}/target_code`,
		'date_time@': `/${TABLE_CITY_FLOW_WORKER}/date_time`
	}
}

function getFlowInAndOut(baseQuery, tableName){
	let result = Object.assign(baseQuery, {
			[tableName]: {
				...CITY_FLOW,
				[tableName]: {
					'target_code@': `[]/${tableName}/source_code`,
					'source_code@': `[]/${tableName}/target_code`,
					'date_time@': `[]/${tableName}/date_time`
				}
			}
		});
	
	return result
}

export const CITY_RESIDENT_FLOW_IN_AND_OUT = getFlowInAndOut(CITY_RESIDENT_FLOW, TABLE_CITY_FLOW_RESIDENT);

export const CITY_WORKER_FLOW_IN_AND_OUT = getFlowInAndOut(CITY_WORKER_FLOW, TABLE_CITY_FLOW_WORKER);

export const CITY_FLOW_INDEX = {
	'@order': 'inflow_population_index-'
}

export const COUNTY_FLOW_WORKLIVE = {
	'@order': 'work_inflow_sort+'
}

export const CITY_STRUCTURE_LIST = {
	[TABLE_COUNTY_SEX_STRUCTURE]: {
		...COUNTY_STRUCTURE
	},
	[TABLE_COUNTY_AGE_STRUCTURE]: {
		'county_code@': `/${TABLE_COUNTY_SEX_STRUCTURE}/county_code`,
		'date_time@': `/${TABLE_COUNTY_SEX_STRUCTURE}/date_time`
	}
}

export const STREET_WORK = {
	[TABLE_STREET_WORKLIVE]: {
		...COUNTY_WORKLIVE
	},
	[TABLE_STREET_WORKLIVE_COUNT]: {
		'code@': `/${TABLE_STREET_WORKLIVE}/live_code`,
		'date_time@': `/${TABLE_STREET_WORKLIVE}/date_time`
	}
}

export const STREET_LIVE = {
	[TABLE_STREET_WORKLIVE]: {
		...COUNTY_WORKLIVE
	},
	[TABLE_STREET_WORKLIVE_COUNT]: {
		'code@': `/${TABLE_STREET_WORKLIVE}/work_code`,
		'date_time@': `/${TABLE_STREET_WORKLIVE}/date_time`
	}
}
export const STREET_HEAT = {
	// '@order': 'average_distance-'
}