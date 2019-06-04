import {
    getColor,
    getTooltip,
    getLegend,
  } from '../config/pieConfig.js';
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
        obj.config={};
        merge(obj.config, {
          tooltip: getTooltip(),
          legend: getLegend(),
          color: getColor(),
          series: []
        });
      }
    }
  };
  