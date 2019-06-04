import {
  getGrid,
  getColor,
  getTooltip,
  getLegend,
  getXAxis,
  getYAxis
} from '../config/axisConfig.js';
import { merge,copy } from '../libs/util.js';

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
        grid: getGrid(),
        tooltip: getTooltip(),
        legend: getLegend(),
        color: getColor(),
        xAxis: getXAxis(),
        yAxis: getYAxis(),
        series: []
      });
    },
    updateGrid() {
      const { config } = this.getChart();
      //数组的情况现在不知道什么情况出现,后期可以考虑删除
      if (Array.isArray(this.config.grid)) {
        let _grid = [];
        this.config.grid.forEach(item => {
          _grid.push(merge(getGrid(), item));
        });
        config.grid = _grid;
      } else {
        merge(config.grid, this.config.grid || {});
      }
    },
    updateXAxis() {
      const obj = this.getChart();
      if (Array.isArray(this.config.xAxis)) {
        let _xAxis = [];
        this.config.xAxis.forEach(item => {
          // 合并用户配置到默认配置项
          _xAxis.push(merge(copy(obj.config.xAxis), item));
        });
        obj.config.xAxis = _xAxis;
      } else {
        merge(obj.config.xAxis, this.config.xAxis || {});
      }
    },
    updateYAxis() {
      const obj = this.getChart();
      if (Array.isArray(this.config.yAxis)) {
        let _yAxis = [];
        this.config.yAxis.forEach(item => {
          // 合并用户配置到默认配置项
          _yAxis.push(merge(copy(obj.config.yAxis), item));
        });
        obj.config.yAxis = _yAxis;
      } else {
        merge(obj.config.yAxis, this.config.yAxis || {});
      }
    }
  }
};
