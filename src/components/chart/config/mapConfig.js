import { getTooltip as _getTooltip } from './baseConfig.js';
import { merge } from '../libs/util.js';
export const getTooltip = () => {
  return merge(_getTooltip(), { trigger: 'item', formatter: '{b}:{c}' });
};
