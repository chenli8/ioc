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
export const getGeo = () => {
  return {
    map: '',
    label: {},
    roam: false,
    itemStyle: {
      areaColor: '#0C264D',
      borderColor: '#30A1CB'
    },
    emphasis: {
      areaColor: '#0C264D'
    }
  };
};
