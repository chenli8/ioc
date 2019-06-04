const humps = require('humps');
import {isString, isArray,isPlainObject} from '../../lib/util.js';
import clone from 'clone';

function getPrefixArray(prefix = ''){
	return prefix.split('.').filter( item => !!item )
}

export function getCamelizeStrategies(strategies, prefix){
	let prefixArr = getPrefixArray(prefix),
		isRelative = /^\./;

	return strategies.map( strategy => {
		let sourceKey,
			isStringStrategy = isString(strategy);

		if(isStringStrategy){
			sourceKey = strategy;

			strategy = {
				key: humps.camelize(strategy),
				sourceKey
			};
		}else if(isPlainObject(strategy)){
			strategy = clone(strategy);
			sourceKey = strategy.sourceKey || '';
		}

		if(prefixArr.length && (isStringStrategy || isRelative.test(sourceKey))){
			sourceKey = sourceKey.replace(isRelative, '');
			strategy.sourceKey = [...prefixArr, sourceKey].join('.');
		}
		
		return strategy
	})
}

function convertStrategiesPrefix(strategy, prefixArr){
	if(isArray(strategy)){
		strategy = strategy.map( item => convertStrategiesPrefix(item, prefixArr) )
	}else if(isString(strategy)){
		let strategyArr = strategy.split('.');

		strategyArr.splice(-1, 0, ...prefixArr)
		
		strategy = strategyArr.join('.');
	}

	return strategy
}

export function getFilterStrategies(strategies, prefix){
	let prefixArr = getPrefixArray(prefix),
		key;
		
	strategies = clone(strategies);

	if(prefixArr.length){
		for (key in strategies) {
			let strategy = strategies[key];

			strategies[key] = convertStrategiesPrefix(strategy, prefixArr);
		}
	}
	
	return strategies
}
