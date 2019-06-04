import deepmerge from 'deepmerge';
export const oneOf = function(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (validList[i] === value) {
      return true;
    }
  }
  return false;
};
export const setThemeJson = function(list, validList) {
  const skinList = [];
  validList.map(item => {
    list.map(items => {
      if (item.theme == items) {
        skinList.push(item);
      }
    });
  });
  return skinList;
};
export const typeOf = function(obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
};
export const isString = function(str) {
  return typeOf(str) == 'string';
};
export const isFunction = function(fn) {
  return typeOf(fn) == 'function';
};
export const isPlainObject = function(obj) {
  return typeOf(obj) == 'object';
};
export const isDate = function(date) {
  return typeOf(date) == 'date';
};
export const isArray = function(array) {
  return Array.isArray(array);
};
export const deepCopy = function(data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
};
//千分位
export const delimiter = function(val) {
  return String(val).replace(/\B(?=(\d{3})+$)/g, ',');
};
/**
 * 合并
 * @param {Object} obj1
 * @param {Object} obj2
 * @return Object
 */
export const merge = (obj1, obj2, replace = true) => {
  for (let p in obj2) {
    try {
      if (obj2[p].constructor === Object) {
        if (!obj1[p]) {
          obj1[p] = {};
        }
        obj1[p] = merge(obj1[p], obj2[p]);
      } else if (obj2[p].constructor === Array) {
        if (replace) {
          let _obj = merge(obj1[p] || [], obj2[p]);
          //判断数组长度是否一致
          if (_obj.length !== obj2[p].length) {
            _obj = _obj.slice(0, obj2[p].length);
          }
          obj1[p] = _obj;
        } else {
          obj1[p] = (obj1[p] || []).concat(obj2[p]);
        }
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  }

  return obj1;
};
/**
 * 创建echart空对象
 * @param {Object} config 标准配置
 * @param {Object||Array} data 数据
 * @param {Object} other 自定义或series配置
 * @return Object {config,data,other}
 */
export const createChartTemp = (config = {}, data = [], other = {}) => {
  return {
    config,
    data,
    other
  };
};

export const units = ['%', '万人','人'];

export const formatThousands = (num, fixed = 2) => {
  return Number((num / 10000).toFixed(fixed));
};
export const toFixed = (num, fixed = 2) => {
  return Number(num.toFixed(fixed));
};

/**
 * 对请求的原始数据进行转换符合charts 需要
 * @param {Array} data 原数据
 * @param {Array||Object} config 转出的格式 数组||对象
 * @return {Array||Object}
 */
export const convertArrayData = (data = [], config = [], other = {}) => {
  // nameKeys 表示把原数据的哪些key转换为新数据key=name1,name2.....
  // valueKeys 表示把原数据的哪些key转换为新数据key=value1,value2.....
  const type = typeOf(config);
  let _data = [];
  if (config.length === 0) {
    return [];
  }
  if (type === 'object') {
    const item = config;
    data.forEach(d => {
      let _item = {};
      //set name
      if (item.nameKeys && item.nameKeys.length) {
        item.nameKeys.forEach((nameKey, index) => {
          const nameValue =
            (item.nameValues && item.nameValues[index]) || d[nameKey];
          _item[`name${index + 1}`] = nameValue;
        });
      } else if (item.nameValues && item.nameValues.length) {
        item.nameValues.forEach((nameValue, index) => {
          _item[`name${index + 1}`] = nameValue;
        });
      }
      //set value
      if (item.valueKeys && item.valueKeys.length) {
        item.valueKeys.forEach((valueKey, index) => {
          const value =
            (item.valueValues && item.valueValues[index]) || d[valueKey];
          _item[`value${index + 1}`] = value || 0;
        });
      } else if (item.valueValues && item.valueValues.length) {
        item.valueValues.forEach((value, index) => {
          _item[`value${index + 1}`] = value || 0;
        });
      }

      // set other
      for (let key in item) {
        if (
          key !== 'nameKeys' &&
          key !== 'nameValues' &&
          key !== 'valueKeys' &&
          key !== 'valueValues'
        ) {
          _item[key] = item[key];
        }
      }
      for (let k in d) {
        //true 表示不存在
        const nameKeyIndex = item.nameKeys && item.nameKeys.indexOf(k) === -1;
        const nameValueIndex =
          item.nameValues && item.nameValues.indexOf(k) === -1;
        const valueKeyIndex =
          item.valueKeys && item.valueKeys.indexOf(k) === -1;
        const valueValueIndex =
          item.valueValues && item.valueValues.indexOf(k) === -1;
        if (
          (nameKeyIndex === undefined || nameKeyIndex === true) &&
          (nameValueIndex === undefined || nameValueIndex === true) &&
          (valueKeyIndex === undefined || valueKeyIndex === true) &&
          (valueValueIndex === undefined || valueValueIndex === true)
        ) {
          _item[k] = d[k];
        }
      }
      for(let o in other){
        _item[o] = d[other[o]];
      }
      _data.push(_item);
    });
  } else if (type === 'array') {
    config.forEach(item => {
      let _item = {};
      data.forEach((d, index) => {
        //set name
        if (item.nameKeys && item.nameKeys.length) {
          item.nameKeys.forEach(nameKey => {
            const nameValue =
              (item.nameValues && item.nameValues[index]) || d[nameKey];
            _item[`name${index + 1}`] = nameValue;
          });
        } else if (item.nameValues && item.nameValues.length) {
          item.nameValues.forEach(nameValue => {
            _item[`name${index + 1}`] = nameValue;
          });
        }
        //set value
        if (item.valueKeys && item.valueKeys.length) {
          item.valueKeys.forEach(valueKey => {
            const value =
              (item.valueValues && item.valueValues[index]) || d[valueKey];
            _item[`value${index + 1}`] = value || 0;
          });
        } else if (item.valueValues && item.valueValues.length) {
          item.valueValues.forEach(value => {
            _item[`value${index + 1}`] = value || 0;
          });
        }
      });
      // set other
      for (let key in item) {
        if (
          key !== 'nameKeys' &&
          key !== 'nameValues' &&
          key !== 'valueKeys' &&
          key !== 'valueValues'
        ) {
          _item[key] = item[key];
        }
      }
      _data.push(_item);
    });
  }
  return _data;
};
/**
 * 对请求的原始数据进行转换符合charts 需要
 * @param {Object} data 原数据
 * @param {Array||Object} config 转出的格式 数组||对象
 * @return {Array||Object}
 */
export const convertObjectData = (data = {}, config = {}) => {
  // nameKeys 表示把原数据的哪些key转换为新数据key=name1,name2.....
  // valueKeys 表示把原数据的哪些key转换为新数据key=value1,value2.....
  const keys = Object.keys(data);
  const type = typeOf(config);
  let _data = type === 'object' ? {} : [];
  if (keys.length === 0) {
    return _data;
  }
  if (type === 'object') {
    _data = convertObjectData(data, [config])[0];
  } else if (type === 'array') {
    for (let i = 0; i < config.length; i++) {
      const item = config[i];
      const _item = {};
      //set name
      if (item.nameKeys && item.nameKeys.length) {
        item.nameKeys.forEach((nameKey, index) => {
          const nameValue =
            (item.nameValues && item.nameValues[index]) || data[nameKey];
          _item[`name${index + 1}`] = nameValue;
        });
      } else if (item.nameValues && item.nameValues.length) {
        item.nameValues.forEach((nameValue, index) => {
          _item[`name${index + 1}`] = nameValue;
        });
      }
      //set value
      if (item.valueKeys && item.valueKeys.length) {
        item.valueKeys.forEach((valueKey, index) => {
          const value =
            (item.valueValues && item.valueValues[index]) || data[valueKey];
          _item[`value${index + 1}`] = value || 0;
        });
      } else if (item.valueValues && item.valueValues.length) {
        item.valueValues.forEach((value, index) => {
          _item[`value${index + 1}`] = value || 0;
        });
      }
      // set other
      for (let key in item) {
        if (
          key !== 'nameKeys' &&
          key !== 'nameValues' &&
          key !== 'valueKeys' &&
          key !== 'valueValues'
        ) {
          _item[key] = item[key];
        }
      }
      _data.push(_item);
    }
  }
  return _data;
};
/**
 * 转换时间格式
 * @param  {String} str 时间 '2018-12'
 * @return {String} 时间 '2018.12'
 */
export const dateTransition = str => {
  return str.indexOf('-') > -1 ? str.replace('-', '.') : str.replace('.', '-');
};
export const interceptCityName = str => {
  const index = str.indexOf('市');
  return str.substring(0, index > -1 ? index : str.length);
};
export const debounce = (fn, speed = 300) => {
  let time;
  return function() {
    let that = this;
    let args = arguments;
    clearTimeout(time);
    time = setTimeout(function() {
      fn.apply(that, args);
    }, speed);
  };
};
export const autoSize = () => {
  const standardWidth = Number(process.env.VUE_APP_SCREEN_WIDTH);
  const standardHeight = Number(process.env.VUE_APP_SCREEN_HEIGHT);
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  const scaleWidth = clientWidth / standardWidth;
  const scaleHeight = clientHeight / standardHeight;
  document.body.style.transform = `scale(${scaleWidth},${scaleHeight})`;
  document.body.style.transformOrigin = 'left top';
};
/**
 * 根据path获取对象的值
 * @param  {[type]} object [description]
 * @param  {[type]} path   [description]
 * @return {[type]}        [description]
 */
export function getValueByPath(object, path) {
  let pathArr = path.split('.'),
    key;

  while (object && pathArr.length) {
    key = pathArr.shift();
    object = object[key];
  }

  return object;
}

/**
 * 日期格式化， by haozhenjia
 * @param  {[type]} date [description]
 * @param  {String} fmt  [description]
 * @return {[type]}      [description]
 */
export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm') {
  let o,
    isTimestamp = /^\d{0,10}$/;

  date = isDate(date)
    ? date
    : isTimestamp.test(date)
    ? new Date(date * 1000)
    : new Date(date);
  o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

export function getMonthList(
  dateStr,
  { number = 3, descFormat = 'yyyy-MM', valueFormat = 'yyyy-MM' }
) {
  let date = new Date(dateStr),
    year = date.getFullYear(),
    month = date.getMonth(),
    list = [];

  while (number > 0) {
    list.push({
      value: dateFormat(date, valueFormat),
      desc: dateFormat(date, descFormat)
    });
    if (!number--) break;

    if (month) {
      month -= 1;
    } else {
      month = 11;
      year -= 1;
    }

    date.setFullYear(year, month);
  }

  return list;
}

/**
 * 将location.hash，解析成对象
 * @return {[type]} [description]
 */
export function getLocationParams() {
  let segments = location.search.replace(/^\?/, '').split('&'),
    params = {};

  segments.forEach(segment => {
    if (!segment) return;

    let [key, value] = segment.split('=');

    params[key] = value;
  });

  return params;
}

/**
 * 将小数转换成百分数
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
export function floatToPercent(num, toFixed = 2, addUnit) {
  let isFloat = /^-?\d+\.\d+$/,
    percent = num;

  if (isFloat.test(num)) {
    percent = (Number(num) * 100).toFixed(toFixed);
  }

  return addUnit ? percent + '%' : +percent;
}
