import echarts from 'echarts';
import { merge, typeOf } from '../libs/util.js';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    series: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    const chart = {
      config: {},
      echartObj: null
    };
    return {
      getChart() {
        return chart;
      }
    };
  },
  methods: {
    /**
     *初始化chart
     *
     */
    initChart() {
      this.initDefaultOption();
      this.initConfig();
      const chart = this.getChart();
      let config = chart.config;
      let echartObj = chart.echartObj;
      if (!echartObj) {
        echartObj = echarts.init(this.$refs.chart);
        chart.echartObj = echartObj;
        window.addEventListener('resize', echartObj.resize);
      }
      // console.log('echart.option===', JSON.stringify(config));
      echartObj.setOption(config, true);
    },
    /**
     *初始化配置项
     *
     */
    initConfig() {
      const obj = this.getChart();
      //默认配置项keys
      const defaultKeys = Object.keys(obj.config);
      //用户配置项keys
      const configKeys = Object.keys(this.config);
      //合并配置项keys
      const keys = Array.from(new Set([].concat(defaultKeys, configKeys)));
      keys.forEach(key => {
        //用户传入了此key的配置项
        if (configKeys.indexOf(key) !== -1) {
          const type = typeOf(this.config[key]);
          //默认配置缺少key
          if (defaultKeys.indexOf(key) === -1) {
            switch (type) {
              case 'string':
                obj.config[key] = this.config[key]||'';
                break;
              case 'object':
                obj.config[key] = {};
                break;
              case 'boolean':
                obj.config[key] = this.config[key]||false;
                break;
              case 'array':
                obj.config[key] = [];
                break;
              case 'function':
                obj.config[key] = function() {};
                break;
              default:
                obj.config[key] = undefined;
                break;
            }
          }
          const fnName = `update${key.charAt(0).toUpperCase() + key.slice(1)}`;
          if (fnName !== 'updateSeries') {
            //此key有对应的方法(updateXXX)
            this[fnName]
              ? this[fnName]()
              : merge(obj.config[key], this.config[key]);
          }
        }
      });
      //最后调用updateSeries在于 如果在keys循环时调用的话(keys内key是无序的),某些其它config项还未合并完.
      this.updateSeries();
    },

    updateTooltip() {
      const obj = this.getChart();
      merge(obj.config.tooltip || {}, this.config.tooltip || {});
    },

    updateLegend() {
      const obj = this.getChart();
      merge(obj.config.legend || {}, this.config.legend || {});
    },
    updateColor() {
      const obj = this.getChart();
      obj.config.color = [].concat(this.config.color);
    },
    updateSeries() {
      const obj = this.getChart();
      obj.config.series = this.series;
    },
    destoryChart() {
      let obj = this.getChart();
      if (obj.echartObj) {
        window.removeEventListener('resize', obj.echartObj.resize);
        obj.echartObj.dispose();
        obj.echartObj = null;
      }
    }
  },
  beforeDestroy() {
    this.destoryChart();
  }
};
