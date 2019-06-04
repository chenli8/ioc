import { COLORS, FONTCOLOR } from './color.js';

/**
 * export const tooltip = {
 *    show: true,
 *    trigger: 'axis'
 * };
 * 如果使用变量返回值是引用类型(复合类型)
 * 外部使用的话需要写copy方法复制一份,防止原数据被修改
 * 所有此处全部是使用fn返回值外部直接调用fn() 不存在原数据被修改的情况
 */

export const getColor = () => {
  return [].concat(COLORS);
};
export const getTooltip = () => {
  return {
    show: true,
    trigger: 'axis'
  };
};
export const getLegend = () => {
  return {
    type: 'scroll',
    textStyle: {
      padding: [0, 0, 3, 8],
      color: FONTCOLOR
    },
    data: []
  };
};
