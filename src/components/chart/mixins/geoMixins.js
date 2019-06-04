import echarts from 'echarts';
import {
  getColor,
  getTooltip,
  getLegend,
  getGeo
} from '../config/geoConfig.js';
import { merge } from '../libs/util.js';
export default {
  props: {},
  methods: {
    /**
     * 初始化默认配置项
     *
     */
    initDefaultOption() {
      let obj = this.getChart();
      obj.config = {};
      merge(obj.config, {
        tooltip: getTooltip(),
        legend: getLegend(),
        color: getColor(),
        geo: getGeo(),
        series: []
      });
    },
    updateSeries() {
      const { config } = this.getChart();
      if (config.geo) {
        //判断是否已经加载对应的地图
        let name = config.geo.map || 'china';
        if(config.geo.outline){
          name+='-outline';
          config.geo.map=name;
        }

        let map = echarts.getMap(name);
        if (!map) {
          let geo = config.geo.geo;
          if (geo === undefined && name.indexOf('china')>-1) {
            geo = require('../data/china.json');
          }
          echarts.registerMap(name, geo);
        }
        if (name.indexOf('china')>-1) {
          map = echarts.getMap(name);
          //全国围栏轮廓
          const index = map.geoJson.features.findIndex(item => {
            return item.id === '000000';
          });
          if (config.geo.outline === true && index === -1) {
            const outline = require('../data/china-outline.json');
            const nanhai = require('../data/nanhai.json');
            map.geoJson.features.push(outline.features[0],nanhai.features[0]);
          } else if (config.geo.outline === undefined && index > -1) {
            map.geoJson.features.pop();//china-outline
            map.geoJson.features.pop();//nanhai
          }
        }
        if (config.geo.geo) {
          //config.geo.geo 私有属性禁止传递到echarts
          delete config.geo.geo;
        }
        if (config.geo.outline) {
          //config.geo.outline 私有属性禁止传递到echarts
          delete config.geo.outline;
        }

        config.series = this.series;
      }
    }
  }
};
