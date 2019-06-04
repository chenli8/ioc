import { FONTCOLOR } from './color.js';
import {
  getColor as _getColor,
  getTooltip as _getTooltip,
  getLegend as _getLegend
} from './baseConfig.js';

export const getColor = () => {
  return [].concat(_getColor());
};

export const getTooltip = () => {
  return _getTooltip();
};

export const getLegend = () => {
  return _getLegend();
};
export const getGrid = () => {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    containLabel: true
  };
};

export const getXAxis = () => {
  return {
    type: 'category',
    boundaryGap: ['0%', '0%'],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      color: FONTCOLOR
    },
    data:[]
  };
};

export const getYAxis = () => {
  return {
    type: 'value',
    boundaryGap: ['0%', '0%'],
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: FONTCOLOR
    }
  };
};
