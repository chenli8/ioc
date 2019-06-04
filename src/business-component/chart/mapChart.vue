<template>
  <div class="ui-mapchart-container">
    <Map :series="chart.series" :config="chart.config" ref="map"></Map>
    <div
      v-show="legend.show"
      class="ui-mapchart-legend-container"
      :style="{left:legend.left,top:legend.top,right:legend.right,bottom:legend.bottom}"
    >
      <span class="ui-mapchart-legend-title">{{legend.name}}</span>
      <div class="ui-mapchart-legend-item" v-for="(item,index) in legend.data" :key="index">
        <span class="ui-mapchart-legend-icon" :style="{background:item.color}"></span>
        <span v-if="typeof(item.end)!=='string'">{{item.start}}~{{item.end}}{{legend.unit||''}}</span>
        <span v-else>{{item.end}}{{item.start}}{{legend.unit||''}}</span>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 围栏图
 */
import hexToRgba from '@/lib/hexToRgba.js';
import { merge, createChartTemp, toFixed, isArray } from '@/lib/util.js';
import Map from '@/components/chart/map.vue';
import { getMapConfig, getMapSeriesConfig, MAPCOLORS, MAPBORDERCOLORS, WHILE, MAPCOLORSOPACITY, MAPCOLORSBORDEROPACITY } from '@/business-component/chart/chart.config.js';
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    other: {
      type: Object,
      default: () => {
        return
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      chart: createChartTemp(),
      legend: {
        name: '',
        unit: '',
        show: false,
        left: '',
        right: '',
        top: '',
        bottom: '',
        data: []
      },
      timer: null,
      currentIndex: -1,
      mapName: ''
    }
  },
  watch: {
    data: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  },
  components: { Map },
  mounted() {
  },
  methods: {
    renderChart() {
      let series = [];
      let config = getMapConfig();
      merge(config, this.config);
      let seriesConfig = getMapSeriesConfig();
      const otherSeriesConfig = isArray(this.other.series) ? this.other.series[0] || {} : this.other.series || {};
      merge(seriesConfig, otherSeriesConfig);
      //set colors
      const list = this.setColors(this.data);
      list.forEach((item, index) => {
        item.color = config.color[index] || MAPCOLORS[0];
      });
      // set units
      let units = [];
      const listLen = list.length;
      //默认outline=true有轮廓
      const outline = config.outline !== undefined && config.outline === false ? false : true;
      let seriesData = this.data.map((item) => {
        const value = item.value;
        let index = 0;
        for (let i = 0; i < listLen; i++) {
          const split = list[i];
          if ((value >= split.start && typeof (split.end) === 'string') || (value >= split.start && value < split.end) || (value === split.end && i === listLen - 1)) {
            index = i;
            break;
          }
        }
        const itemColor = config.color[index] || MAPCOLORS[0];
        const itemBorderColor = (config.borderColor && config.borderColor[index]) || MAPBORDERCOLORS[0];
        units.push(item.unit || '');
        let _item = {
          name: item.name,
          value: this.other.integer ? toFixed(item.value, 0) : item.value,
          itemStyle: {
            areaColor: hexToRgba(itemColor, MAPCOLORSOPACITY[index]),
            borderWidth: 2,
            borderColor: hexToRgba(itemBorderColor, MAPCOLORSBORDEROPACITY[index]),

          },
          emphasis: {
            label: {
              color: WHILE
            },
            itemStyle: {
              areaColor: hexToRgba(itemColor, 0.8),
              borderWidth: 3,
              borderColor: WHILE
            }
          }
        }
        //如果存在外围轮廓则把每条数据的阴影删除
        if (outline) {
          _item.itemStyle.shadowColor = '';
          _item.itemStyle.shadowOffsetX = 0;
          _item.itemStyle.shadowOffsetY = 0;
        }
        return _item;
      });
      //set tooltip
      if (config.tooltip && config.tooltip.show && config.tooltip.formatter === undefined) {
        config.tooltip.formatter = (p) => {
          let str = '';
          const item = seriesData[p.dataIndex];
          str += item === undefined ? '' : `${p.name}: ${item.value} ${units[p.dataIndex] || ''}<br/>`;
          return str;
        }
      }

      seriesConfig.data = seriesData;
      if (seriesConfig.label && outline) {
        const name = seriesConfig.map;
        this.mapName = name;
        seriesConfig.label.formatter = (par) => {
          return par.name.toLocaleLowerCase() === name ? '' : par.name;
        }
      }
      series.push(seriesConfig);
      config.outline = outline;
      this.chart.config = config;
      this.chart.series = series;
      //set legend
      if (config.legend && config.legend.show) {
        const legend = config.legend;
        this.legend.show = true;
        this.legend.name = legend.name || '';
        this.legend.unit = legend.unit || '';
        this.legend.left = legend.left !== undefined ? typeof (legend.left) === 'number' ? legend.left + 'px' : legend.left : '';
        this.legend.right = legend.right !== undefined ? typeof (legend.right) === 'number' ? legend.right + 'px' : legend.right : '';
        this.legend.bottom = legend.bottom !== undefined ? typeof (legend.bottom) === 'number' ? legend.bottom + 'px' : legend.bottom : '';
        this.legend.top = legend.top !== undefined ? typeof (legend.top) === 'number' ? legend.top + 'px' : legend.top : '';
        this.legend.data = (merge([], list)).reverse();
      }
      if (this.data && this.data.length) {
        //轮播继续,只切换数据
        if (this.other.continuance && this.timer !== null) {
          setTimeout(() => {
            const { echartObj } = this.$refs.map.getChart();
            this.setMapArea(echartObj, this.currentIndex);
          }, 0);

        } else {
          this.stop();
          setTimeout(() => {
            const { echartObj } = this.$refs.map.getChart();
            this.changeMap(this.data[0]);
            this.setMapArea(echartObj, 0);
            this.clickMap();
            // auto play
            if (this.other.play) {
              this.start(1);
            }
          }, 100);
        }
      }
    },
    setColors(data) {
      const segment = 5;
      let values = data.map((item) => { return item.value });
      values.sort((a, b) => { return a - b; });
      //计数(每个数值出现的次数)
      let obj = {};//{19:1,23:3}// 19出现1次 23出现3次
      values.forEach((value) => {
        let item = obj[value];
        obj[value] = item !== undefined ? item += 1 : 1;
      });
      let keys = Object.keys(obj);
      //计算分段 每个数值出现的次数总和=values.length; 分成多少段
      const single = values.length / segment;
      const vals = Object.values(obj);
      let res = [];
      let total = 0;
      //遍历数值出现次数
      for (let i = 0; i < vals.length; i++) {
        const count = vals[i];
        total += count;
        if (total >= single) {
          //记录该数值索引
          res.push(i);
          total = 0;
        }
      }
      //vals最后一个存入数组中
      if (res[res.length - 1] !== vals.length - 1) {
        res.push(vals.length - 1);
      }
      //判断res是否分成了预期segment段
      const difference = segment - res.length;
      //插值
      for (let i = 0; i < difference; i++) {
        let max = 0;
        for (let r = 0; r < res.length; r++) {
          const item = res[r];
          let prev = 0;
          if (r === 0) {
            prev = 0;
          } else {
            prev = res[r - 1];
          }
          //计算相邻数值的差
          const temp = item - prev;
          if (temp > max) {
            max = temp;
          }
        }
        if (max <= vals.length - 1) {
          res.push(max);
        }
        res.sort((a, b) => { return a - b; });

      }
      //去重
      res = Array.from(new Set(res));
      let list = res.map((item, index) => {
        let start = 0;
        let end = 0;
        if (index === 0) {
          start = Number(keys[0]);
        } else {
          const perv = res[index - 1];
          start = Number(keys[perv]);
        }
        end = Number(keys[item]);
        return {
          start,
          end
        }
      });

      if (list.length === segment - 1) {
        const last = list[list.length - 1];
        list.push({
          start: last.end,
          end: '大于'
        });
      }
      console.log(list,'====list')
      return list;
    },
    start(dataIndex) {
      //等待echartObj初始化对象,防止echartObj=null
      const { echartObj } = this.$refs.map.getChart();
      if (echartObj !== null) {
        const data = this.chart.series[0].data;
        const dataLength = data.length;
        let count = dataIndex || 0;
        this.timer = setTimeout(() => {
          this.setMapArea(echartObj, count % dataLength);
          this.changeMap(data[count % dataLength]);
          count++;
          this.start(count++);
        }, this.other.speed || 15000);
      }
    },
    reset(dataIndex) {
      //等待echartObj初始化对象,防止echartObj=null
      const { echartObj } = this.$refs.map.getChart();
      if (echartObj !== null) {
        this.stop();
        this.setMapArea(echartObj, dataIndex);
        this.start((dataIndex || 0) + 1);
      }
    },
    stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.currentIndex = -1;
    },
    setMapArea(echartObj, dataIndex) {
      this.currentIndex = dataIndex;
      echartObj.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })
      echartObj.dispatchAction({
        type: 'highlight',
        // 可选，系列 index，可以是一个数组指定多个系列
        seriesIndex: 0,
        dataIndex,
      })
    },
    clickMap() {
      const that = this;
      setTimeout(() => {
        const obj = this.$refs.map.getChart();
        obj.echartObj.off('click');
        obj.echartObj.on('click', (item) => {
          if ((item.name && item.name.toLocaleLowerCase()) !== that.mapName) {
            this.changeMap({
              name: item.name,
              value: item.value
            });
            this.setMapArea(obj.echartObj, item.dataIndex);
            if (this.other.play) {
              this.stop();
              //+1从下一个开始播放
              this.start(item.dataIndex + 1);
            }
          }
        })
      }, 100);
    },
    changeMap(item) {
      const data = this.data.find((d) => {
        return d.name === item.name;
      });
      if (data !== undefined) {
        this.$emit('changeMap', data);
      }
    },
    getCurrentIndex() {
      return this.currentIndex;
    }

  },
  beforeDestroy() {
    this.stop();
  }
}
</script>
<style>
.ui-mapchart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
.ui-mapchart-legend-container {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #a5dcff;
  font-size: 12px;
}
.ui-mapchart-legend-title {
  display: inline-block;
  margin-bottom: 8px;
}
.ui-mapchart-legend-item {
  margin-bottom: 6px;
}
.ui-mapchart-legend-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 2px;
}
</style>

