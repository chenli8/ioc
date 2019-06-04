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
export const typeOf = obj => {
  return map[Object.prototype.toString.call(obj)];
};

export const copy = data => {
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
      o.push(copy(data[i]));
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = copy(data[i]);
    }
  }
  return o;
};

/**
 * 合并
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns Object
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
