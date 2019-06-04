import axios from '../lib/axios.js';
import {isString, isPlainObject, isFunction, getValueByPath} from '../lib/util.js';
import clone from 'clone';

const CONFIG = {
	filter: {},
	query: {},
	apiJSONUrl: '/get',
	url: '',
	strategies: [],
	_filterStrategies: {},
	_tableName: '',
	apiPrefix: 'data'
}

const PROPS_LIST = [ //Model子类定义的属性列表
	// 'filter',  filter,value等非只读属性
	// 'value',
	'strategies',
	'query'
];

export default class BaseModel{
	constructor(option){
		this.option = Object.assign({}, this._CONFIG, option);
		this._cacheKey = '';
		this._values = {};
		this._initConfigProperty();

		// console.log(this.constructor.name, this);
	}

	get _CONFIG(){
		return CONFIG
	}

	get axios(){
		return axios
	}

	get _isList(){
		return !!this.listParams
	}
	/**
	 * 初始化
	 * @return {[type]} [description]
	 */
	_init(){
		this._normalizeQuery();
		this._normalizeStrategies();
	}
	_initConfigProperty(){
		let {option} = this,
			key;

		for (key in option) {
			this[key] = option[key]
		}
	}
	/**
	 * 发起ajax请求
	 * @return {[type]} [description]
	 */
	request(){
		let {url, apiJSONUrl} = this,
			query = this.getQuery(),
			path = url || apiJSONUrl;
		// console.log(this.constructor.name, 'query', query);
		return this.axios.post(path, query)
	}
	update(noCache){
		let value = this._getCachedValue();

		if(noCache || !value){
			return this.request().then( data => this.updateValue(data) )
		}else{
			return Promise.resolve(value);
		}
		
	}
	updateValue(data){
		let { _tableName, _isList, _values, _cacheKey } = this,
			value;

		if(_isList){
			let list = data['[]'] || [];

			value = list.map( item => this.convertDataByStrategies(item, list));
		}else{

			value = this.convertDataByStrategies(data);
		}
		// console.log(this.constructor.name, 'value', value);
		_values[_cacheKey] = value;

		return value
	}
	_getCachedValue(){
		return this._values[this._cacheKey]
	}
	_updateCacheKey(){
		let {filter} = this,
			keys = new Set();

		for (let filterKey in filter) {
			keys.add(filter[filterKey])
		}

		this._cacheKey = Array.from(keys).join(',');
	}
	/**
	 * 返回当前Model的值
	 * @return {[type]} [description]
	 */
	getValue(){
		return this._getCachedValue()
	}
	/**
	 * 获取APIJSON请求的query对象
	 * @return {Object} [description]
	 */
	getQuery(){
		let {query} = this,
			filter = this._getInnerFilter();
		
		return this._mergeFilterToQuery(query, filter)
	}
	setFilter(filter){
		this.filter = filter;
		this._updateCacheKey();
	}
	convertDataByStrategies(item, list){
		let { _tableName, apiPrefix, url, strategies } = this,
			prefix = url ? apiPrefix : _tableName,
			result = {};

		item = prefix ? item[prefix] : item;

		if(!strategies.length) return item;
		
		item && strategies.forEach( strategy => {
			let {key, sourceKey, getter, computed} = strategy;

			if(computed && isFunction(computed)){
				result[key] = computed(item, list, getValueByPath);
			}else if(getter && isFunction(getter)){
				Object.defineProperty(result, key, {
					get: getter,
					enumerable: true,
					configurable: true
				})
			}else if(sourceKey){
				result[key] = getValueByPath(item, sourceKey);
			}
		});
		
		return result || item
	}
	_normalizeStrategies(){
		let {strategies} = this;

		this.strategies = strategies.map( strategy => {
			if(isString(strategy)){
				return {
					key: strategy,
					sourceKey: strategy
				}
			}else if(isPlainObject(strategy)){
				let { key, sourceKey, getter, computed } = strategy;

				//getter只支持函数
				if(getter && !isFunction(getter)) getter == undefined;

				//computed支持字符串，代表该类的对应方法
				if(isString(computed)){
					computed = this[computed] && this[computed].bind(this);
				}else if(!getter && !sourceKey){//未设置sourceKey，则将其设置为key
					sourceKey = key;
				}

				return {
					key,
					sourceKey,
					getter,
					computed
				}
			}
		})
	}
	_normalizeQuery(){
		let {query, listParams, _isList, _tableName} = this,
			prefixArray = this._getPrefix(),
			length,
			prefix;

		//必须将之拷贝，否则多个类，实例之间公用，会相互影响
		query = clone(query);

		while (length = prefixArray.length) {
			prefix = prefixArray.pop();

			// 在类型为列表时，将listParams合并到
			if(_isList && prefix == '[]'){
				query = Object.assign(query, listParams)
			}

			query = {
				[prefix]: query
			}
		}
		
		this.query = query;
	}
	_getPrefix(convertToString){
		let {_tableName, _isList} = this,
			prefix = [];

		_isList && prefix.push('[]');
		_tableName && prefix.push(_tableName);

		if(convertToString){
			prefix = prefix.length ? prefix.join('.') : '';
		}

		return prefix
	}
	/**
	 * [_getInnerFilter description]
	 * @return {[type]} [description]
	 */
	_getInnerFilter(){
		let {filter, _tableName, _filterStrategies} = this,
			prefix = this._getPrefix(true),
			isRelative = /^\./,
			key,
			innerFilter = {};
		
		for (key in filter) {
			let filterValue = filter[key],
				filterStrategy = _filterStrategies[key];
				
			if(!filterValue || !filterStrategy) continue;

			if(isString(filterStrategy)) filterStrategy = [filterStrategy];

			filterStrategy.forEach( strategy => {
				if(isRelative.test(strategy)){
					strategy = prefix + strategy;
				}

				innerFilter[strategy] = filterValue;
			});
		}
		
		return innerFilter
	}
	/**
	 * 将filter合并到query中
	 * @param  {[type]} query  [description]
	 * @param  {[type]} filter [description]
	 * @return {[type]}        [description]
	 */
	_mergeFilterToQuery(query, filter){
		query = clone(query);
		
		for (let key in filter) {
			let value = filter[key],
				path = key.split('.'),
				tmpKey = path.shift(),
				tmpValue = query;

			while (path.length) {
				if(!tmpValue[tmpKey]) tmpValue[tmpKey] = {};
				tmpValue = tmpValue[tmpKey];

				tmpKey = path.shift();
			}
			
			tmpValue[tmpKey] = value;
		}

		return query
	}
}