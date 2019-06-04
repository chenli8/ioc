import echarts from 'echarts';
import { getTooltip } from '../config/mapConfig.js';
import { merge } from '../libs/util.js';

export default {
  props: {},
  methods: {
    /**
     * 初始化默认配置项
     *
     */
    initDefaultOption() {
      const { config } = this.getChart();
      merge(config, {
        tooltip: getTooltip(),
        series: []
      });
    },
    updateSeries() {
      const { config } = this.getChart();
      const series = this.series;
      let name = series && series.length > 0 ? series[0].map || '' : '';
      if(config.outline){
        name+='-outline';

      }
      if (
        Array.isArray(series) &&
        series[0].geo &&
        name !== undefined
      ) {
        //判断是否已经加载对应的地图
        const map = echarts.getMap(name);
        if (!map) {
          echarts.registerMap(name, series[0].geo);
        }
        series[0].map=name;
        //series[0].geo 私有属性禁止传递到echarts
        if (series[0].geo) {
          delete series[0].geo;
        }
        config.series = series;
      }
    }
  }
};
