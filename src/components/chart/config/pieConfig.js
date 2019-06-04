import {
  getColor as _getColor,
  getTooltip as _getTooltip,
  getLegend as _getLegend
} from './baseConfig.js';
import { merge } from '../libs/util.js';
export const getColor = () => {
  return [].concat(_getColor());
};

export const getTooltip = () => {
  return merge(_getTooltip(), { trigger: 'item'});
};

export const getLegend = () => {
  return _getLegend();
};
