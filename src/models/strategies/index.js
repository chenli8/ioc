/**
 * 人口模型公用strategies，
 * @type {Array}
 */
import {
	TABLE_CITY_FLOW_RESIDENT_COUNT, 
	TABLE_CITY_FLOW_WORKER_COUNT, 
	TABLE_CITY_FLOW_RESIDENT,
	TABLE_CITY_FLOW_WORKER,
	TABLE_COUNTY_WORKLIVE,
	TABLE_COUNTY_SEX_STRUCTURE,
	TABLE_COUNTY_AGE_STRUCTURE,
	TABLE_STREET_WORKLIVE_COUNT
} from '../query/tableName.js';
import {floatToPercent} from '../../lib/util.js';
import {getCamelizeStrategies} from '../util';

const BASE_POPULATION_STRATEGIES = [
	'date_time',
	'live_population',
	'resident_population',
	'work_population'
];
const COUNTY_CONFIG_PREFIX = 'Td_config_administrative_district.';
const BASE_COUNTY_STRATEGIES = [
	'county_code',
	'county_name',
	'date_time'
];
const BASE_CITY_STRATEGIES = [
	'code',
	'name',
	'date_time'
];
/**
 * 城市基本STRATEGIES 2
 * @type {Array}
 */
const CITY_STRATEGIES = [
	'city_code',
	'city_name',
	'date_time'
];

export const SIMPLE_POPULATION_STRATEGIES = [
	...BASE_POPULATION_STRATEGIES,
	'county_code',
	'county_name',
	{
		key: 'chainRatio',
		sourceKey: 'Td_view_county_rate.resident_population_ring'
	},
	{
		key: 'workLiveRatio',
		getter(){
			return + (this.workPopulation / this.livePopulation).toFixed(2)
		}
	}
]

export const POPULATION_STRATEGIES = [
	...SIMPLE_POPULATION_STRATEGIES,
	'resident_population',
	{
		key: 'functionCode',
		sourceKey: `${COUNTY_CONFIG_PREFIX}function_code`
	}, {
		key: 'functionName',
		sourceKey: `${COUNTY_CONFIG_PREFIX}function_name`
	},
	{
		key: 'area',
		sourceKey: `${COUNTY_CONFIG_PREFIX}area`
	},
	{
		key: 'populationDensity',
		getter(){
			return this.residentPopulation / this.area
		}
	}
];

export const CITY_POPULATION_STRATEGIES = [
	...BASE_POPULATION_STRATEGIES,
	'city_code',
	'city_name',
	'population_density',
	'resident_population',
	'live_population_ring',
	'resident_population_ring',
	'work_population_ring',
];

export const COUNTY_WEEK_TREND_STRATEGIES = [
	'county_code',
	'county_name',
	'week_population',
	'day_start',
	'day_end'
];

export const CITY_FLOW_STRATEGIES = [
	'source_code',
	'source_name',
	'date_time',
	{
		key: 'cityName',
		sourceKey: `.target_name`
	}, {
		key: 'cityCode',
		sourceKey: `.target_code`
	}, {
		key: 'inflowRatio',
		getter(){
			return floatToPercent(this.inflow / this.inflowTolal)
		}
	}, {
		key: 'inflow',
		sourceKey: `.population`
	}
];

const CITY_INFLOW_RESIDENT_TOLAL_STRATEGY = {
	key: 'inflowTolal',
	sourceKey: `${TABLE_CITY_FLOW_RESIDENT_COUNT}.inflow_population`
};

const CITY_INFLOW_WORKER_TOLAL_STRATEGY = {
	key: 'inflowTolal',
	sourceKey: `${TABLE_CITY_FLOW_WORKER_COUNT}.inflow_population`
};

function getCityInflowOutflowStrategies(baseStrategies, tableName, totalTableName){
	return [
	...baseStrategies,
	{
		key: 'outflow',
		sourceKey: `.${tableName}.population`
	},
	{
		key: 'netInflow',
		getter(){
			return this.inflow - this.outflow
		}
	}, {
		key: 'outflowTolal',
		sourceKey: `${totalTableName}.outflow_population`
	},{
		key: 'outflowRatio',
		getter(){
			return floatToPercent(this.outflow / this.outflowTolal)
		}
	}, {
		key: 'netInflowTolal',
		sourceKey: `${totalTableName}.net_inflow_population`
	}, {
		key: 'netOutflowTolal',
		sourceKey: `${totalTableName}.net_outflow_population`
	}, {
		key: 'netInflowRatio',
		getter(){
			/**
			 * 净流入占比规则说明
			 * 在A城市的相对其他城市的人口来源与去向中，区分A城市vs B城市的净流入人口值的正负情况进行计算:
				●A城市vs B城市的净流入人口≥0，A城市vs B城市的净流入人口/所有值为正的城市净流入人口之和；
				●A城市vs B城市的净流入人口＜0，A城市vs B城市的净流入人口/所有值为负的城市净流入人口之和；
			 */
			let {netInflow, netInflowTolal, netOutflowTolal} = this,
				flowTolal = netInflow > 0 ? netInflowTolal : netOutflowTolal;
				
			return floatToPercent(netInflow / flowTolal)
		}
	}]
}

export const CITY_FLOW_RESIDENT_STRATEGIES = [
	...CITY_FLOW_STRATEGIES,
	CITY_INFLOW_RESIDENT_TOLAL_STRATEGY
]

export const CITY_FLOW_WORKER_STRATEGIES = [
	...CITY_FLOW_STRATEGIES,
	CITY_INFLOW_WORKER_TOLAL_STRATEGY
];

export const CITY_FLOW_RESIDENT_IN_AND_OUT_STRATEGIES = getCityInflowOutflowStrategies(CITY_FLOW_RESIDENT_STRATEGIES, TABLE_CITY_FLOW_RESIDENT, TABLE_CITY_FLOW_RESIDENT_COUNT);

export const CITY_FLOW_WORKER_IN_AND_OUT_STRATEGIES = getCityInflowOutflowStrategies(CITY_FLOW_WORKER_STRATEGIES, TABLE_CITY_FLOW_WORKER,  TABLE_CITY_FLOW_WORKER_COUNT);

export const CITY_FLOW_TOLAL_STRATEGIES = [
	...BASE_CITY_STRATEGIES,
	{
		key: 'inflowTolal',//流入人口总量
		sourceKey: `inflow_population`
	},
	'inflow_external_rate',//流入人口_省外占比
	'inflow_local_rate',//流入人口_省内占比
	'inflow_ranking', //流入人口省内排名
	{
		key: 'outflowTolal',//流入人口总量
		sourceKey: `outflow_population`
	},
	'outflow_ranking', //总流出人口省内排名
	'outflow_local_rate', //流出人口_省内占比
	'outflow_external_rate', //流出人口_省外占比
	{
		key: 'netInflowTolal',//总量净流入人口数
		sourceKey: `flow_population`
	},{
		key: 'netInflowRanking',//总量净流入人口省内排名
		sourceKey: `flow_ranking`
	},
	'net_inflow_local_rate', //净流入人口总量_省内占比
	'net_inflow_external_rate' // 	净流入人口总量_省外占比
];

/**
 * 省内各市常住流动人口指数排名
 * @type {Array}
 */
export const CITY_FLOW_INDEX_STRATEGIES = [
	...BASE_CITY_STRATEGIES,
	'inflow_population_index',
	'outflow_population_index',
	'net_inflow_population_index'
];

export const CITY_SOURCE_STRATEGIES = [
	...BASE_CITY_STRATEGIES,
	'inflow_population',
	'local_population',
	'total_population',
	{
		key: 'countyName',
		sourceKey:'name'
	},
	{
		key: 'countyCode',
		sourceKey:'code'
	},
	{
		key: 'inflowRate',
		getter(){	
			return floatToPercent(this.inflowPopulation / this.totalPopulation)
		}
	}, {
		key: 'localRate',
		getter(){	
			return floatToPercent(this.localPopulation / this.totalPopulation)
		}
	},
	'inflow_local_rate',
	'inflow_external_rate'
];

export const COUNTY_SOURCE_STRATEGIES = [
	...CITY_SOURCE_STRATEGIES,
	'inflow_ranking',
	'inflow_external_ranking'
];

export const CITY_SOURCE_LIST_STRATEGIES = [
	'source_name',
	'source_code',
	'date_time',
	'inflow_population',
	'inflow_rate',
	{
		key: 'cityName',
		sourceKey: `target_name`
	}, {
		key: 'cityCode',
		sourceKey: `target_code`
	}
]

const COUNTY_AGE = [
	{
		key: 'labour',
		sourceKey: `.15to64_population`
	},
	{
		key: 'old',
		sourceKey: `.65plus_population`
	},
	{
		key: 'children',
		sourceKey: `.0to14_population`
	},
	{
		key: 'total',
		getter(){
			return this.labour + this.children + this.old
		}
	},
	{
		key: 'childrenRatio',
		getter(){
			return floatToPercent(this.children / this.total )
		}
	},
	{
		key: 'oldRatio',
		getter(){
			return floatToPercent(this.old / this.total )
		}
	},
	{
		key: 'labourRatio',
		getter(){
			return floatToPercent(this.labour / this.total )
		}
	},
	{
		key: 'oldDependencyRatio',
		// sourceKey: `65plus_population`,
		getter(){
			return floatToPercent(this.old / this.labour)
		}
	},
	{
		key: 'childrenDependencyRatio',
		getter(){
			return floatToPercent(this.children / this.labour)
		}
	},
	{
		key: 'totalDependencyRatio',
		getter(){
			return floatToPercent((this.children + this.old) / this.labour)
		}
	}
]

export const COUNTY_AGE_STRATEGIES = [
	...BASE_COUNTY_STRATEGIES,
	...COUNTY_AGE
];

const COUNTY_SEX = [
	'female_rate',
	'male_rate'
];

export const COUNTY_SEX_STRATEGIES = [
	...BASE_COUNTY_STRATEGIES,
	...COUNTY_SEX
];
export const COUNTY_STRUCTURE_STRATEGIES = [
	...getCamelizeStrategies(COUNTY_SEX_STRATEGIES, TABLE_COUNTY_SEX_STRUCTURE),
	...getCamelizeStrategies(COUNTY_AGE, TABLE_COUNTY_AGE_STRUCTURE)
];
const COUNTY_WORKLIVE_STRATEGIES = [
	'population',
	'date_time',
	{
		key: 'totalPopulation',
		computed(item, list, getValueByPath){
			let totalPopulation = 1,
				key = `${TABLE_COUNTY_WORKLIVE}.population`;
			
			list.forEach( item => {
				let population = getValueByPath(item, key);
				
				totalPopulation += Number(population)
			});

			return totalPopulation
		}
	},
	{
		key: 'rate',
		getter(){
			return floatToPercent(this.population / this.totalPopulation)
		}
	}
];
export const COUNTY_WORK_STRATEGIES = [
	...COUNTY_WORKLIVE_STRATEGIES,
	'work_county_code',
	'work_county_name',
	{
		key: 'countyCode',
		sourceKey: `live_county_code`
	},{
		key: 'countyName',
		sourceKey: `live_county_name`
	}
];

export const COUNTY_LIVE_STRATEGIES = [
	...COUNTY_WORKLIVE_STRATEGIES,
	'live_county_code',
	'live_county_name',
	{
		key: 'countyCode',
		sourceKey: `work_county_code`
	},{
		key: 'countyName',
		sourceKey: `work_county_name`
	}
];

const COMMUTING_STRATEGIES = 'distance';

export const CITY_COMMUTING_STRATEGIES = [
	...CITY_STRATEGIES,
	COMMUTING_STRATEGIES
]

export const COUNTY_COMMUTING_STRATEGIES = [
	'code',
	'name',
	'A_rate',
	'B_rate',
	'C_rate',
	'D_rate',
	'E_rate',
	'average_distance',
	'commuter_distance_rank',
	'A_name',
	'B_name',
	'C_name',
	'D_name',
	'E_name',
	{
		key: 'aboveDRate',
		getter(){
			return this.dRate + this.eRate
		}
	}
];

export const STREET_COMMUTING_STRATEGIES = [
	...COUNTY_COMMUTING_STRATEGIES,
	{
		key: 'countyCode',
		sourceKey: 'p_code'
	},
	{
		key: 'countyName',
		sourceKey: 'p_name'
	}
];

export const CITY_INFO_STRATEGIES = [
	{
		key: 'cityCode',
		sourceKey: `Td_config_administrative_district.code`
	},
	{
		key: 'cityName',
		sourceKey: `Td_config_administrative_district.name`
	},
	{
		key: 'childrenNum',
		sourceKey: `Td_config_administrative_district.child_num`
	},
	{
		key: 'dateTime',
		sourceKey: 'Td_config_showdata_monthly.date_time'
	},
	{
		key: 'cityFencing',
		sourceKey: 'Td_config_city_geo_fencing.geohash_city'
	},
	{
		key: 'countyFencing',
		sourceKey: 'Td_config_city_geo_fencing.geohash_county'
	},
	{
		key: 'streetFencing',
		sourceKey: 'Td_config_city_geo_fencing.geohash_street'
	},
	{
		key: 'center',
		sourceKey: 'Td_config_city_geo_fencing.cen_point'
	},
	{
		key: 'provinceCode',
		sourceKey: 'Td_config_administrative_district.p_code'
	},
	{
		key: 'provinceName',
		sourceKey: 'Td_config_administrative_district.p_name'
	},
	{
		key: 'siblingsNum',
		sourceKey: 'Td_config_administrative_district.Td_config_administrative_district.child_num'
	}
];

// 城市人口结构
export const CITY_STRUCTURE_STRATEGIES = [
	'city_code',
	'city_name',
	'date_time',
	'urban_population', //城镇人口数
	'rural_population', //乡村人口数
	'urban_rate',//	城镇人口占比
	'rural_rate',//	乡村人口占比
	'male_population',//	男性人口数
	'female_population', //	女性人口数
	'male_rate', //	男性人口占比
	'female_rate', //	女性人口占比
	{
		key: 'sexRate',
		getter(){
			return floatToPercent(this.malePopulation / this.femalePopulation)
		}
	}
]

// 区县跨区职住人口流入
export const COUNTY_FLOW_WORKLIVE_STRATEGIES = [
	{
		key: 'cityCode',
		sourceKey: 'p_city_code'
	},
	{
		key: 'cityName',
		sourceKey: 'p_city_name'
	},
	'county_code',
	'county_name',
	'date_time',
	'work_inflow_population',
	'work_inflow_sort',
	'live_inflow_population',
	'live_inflow_sort'
]

const STREET_WORK = [
	'population',
	{
		key: 'rate',
		getter(){
			return floatToPercent(this.population / this.total)
		}
	}
]

export const STREET_WORK_STRATEGIES = [
	{
		key: 'streetName',
		sourceKey: '.live_name'
	},
	{
		key: 'streetCode',
		sourceKey: '.live_code'
	},
	{
		key: 'targetCode',
		sourceKey: '.work_code'
	},
	{
		key: 'targetName',
		sourceKey: '.work_name'
	},
	{
		key: 'total',
		sourceKey: `${TABLE_STREET_WORKLIVE_COUNT}.work_population`
	},
	...STREET_WORK
];

export const STREET_LIVE_STRATEGIES = [
	{
		key: 'streetName',
		sourceKey: '.work_name'
	},
	{
		key: 'streetCode',
		sourceKey: '.work_code'
	},
	{
		key: 'targetCode',
		sourceKey: '.live_code'
	},
	{
		key: 'targetName',
		sourceKey: '.live_name'
	},
	{
		key: 'total',
		sourceKey: `${TABLE_STREET_WORKLIVE_COUNT}.live_population`
	},
	...STREET_WORK
]
export const STREET_HEAT_STRATEGIES = [
	{
		key: 'liveName',
		sourceKey: '.live_name'
	},
	{
		key: 'liveCode',
		sourceKey: '.live_code'
	},
	{
		key: 'liveLng',
		sourceKey: '.live_lng'
	},
	{
		key: 'liveLat',
		sourceKey: '.live_lat'
	},
	{
		key: 'workName',
		sourceKey: '.work_name'
	},
	{
		key: 'workCode',
		sourceKey: '.work_code'
	},
	{
		key: 'workLng',
		sourceKey: '.work_lng'
	},
	{
		key: 'workLat',
		sourceKey: '.work_lat'
	},
]