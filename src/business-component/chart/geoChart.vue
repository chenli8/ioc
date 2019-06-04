<template>
  <Geo :series="chart.series" :config="chart.config" ref="geo"></Geo>
</template>

<script>
/**
 * geo图
 */
import { merge, createChartTemp, isArray, interceptCityName } from '@/lib/util.js';
import GeoCoord from '@/lib/geoCoord.js';
import Geo from '@/components/chart/geo.vue';
import { getIcon, getGeoConfig, getGeoSeriesConfig, GRADIENTCOLORS, COLORS, RED } from '@/business-component/chart/chart.config.js';
import { constants } from 'fs';
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
      chart: createChartTemp()
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
  components: { Geo },
  mounted() {
  },
  methods: {
    renderChart() {
      // data=[{from:{name:'beijing'},to:[{name:'shanghai',value:12},{name:'guangzhou',value:18}]},{from:{name:'wenzhou'},to:[{name:'beijing',value:42},{name:'nanjing',value:67}]}] (每一组{} 表示一组飞行数据)
      // data = [{ from: [{ name: 'shanghai', value: 12 }, { name: 'guangzhou', value: 18 }], to: { name: 'beijing' } }];
      const data = this.data;
      let config = getGeoConfig();
      let legendData = [];
      let series = [];
      merge(config, this.config);
      let coord = this.other.geoCoord || GeoCoord;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let seriesConfig = getGeoSeriesConfig();
        //this.other.series 数据类型必须是数组,因为seriesConfig是数组类型
        const otherSeriesConfig = isArray(this.other.series) ? this.other.series : [];
        const otherSeriesLen = otherSeriesConfig.length;
        //说明存在多组飞线或散点
        if (otherSeriesLen > 2) {
          //获取多组对应配置项目
          const index = i * 2;
          const flyConfig = otherSeriesConfig[index] || {};
          const scatterConfig = otherSeriesConfig[index + 1] || {};
          merge(seriesConfig, [flyConfig, scatterConfig]);
        } else {
          merge(seriesConfig, otherSeriesConfig);
        }

        legendData.push(item.name || '');
        const unit = (seriesConfig[1] && seriesConfig[1].label && seriesConfig[1].label.unit) || '';
        //判断 from to 类型 决定飞行方向
        let fromType;
        if (item.from !== undefined) {
          fromType = isArray(item.from);
        }
        const flyIntercept = seriesConfig[0].label && seriesConfig[0].label.intercept === false ? false : true;
        let flyDataList = fromType ? this.getFlyDataList(item.from, item.to, coord, flyIntercept) : this.getFlyDataList(item.to, item.from, coord, flyIntercept);
        // 有可能只存在散点 没有飞线的情况
        let scatterDataType;
        if (item.scatterData !== undefined) {
          scatterDataType = isArray(item.scatterData);
        }
        let scatterDataList;
        const scatterIntercept = seriesConfig[1].label && seriesConfig[1].label.intercept === false ? false : true;
        if (scatterDataType) {
          scatterDataList = this.getScatterDataList(item.scatterData, coord, unit, scatterIntercept);
        } else {
          scatterDataList = fromType ? this.getScatterDataList(item.from, coord, unit, scatterIntercept) : this.getScatterDataList(item.to, coord, unit, scatterIntercept);
        }
        if (fromType === false) {
          //反转 from to
          flyDataList.forEach((fly) => {
            const fromName = fly.fromName;
            const toName = fly.toName;
            fly.fromName = toName;
            fly.toName = fromName;
            fly.coords.reverse();
          });
        }
        //from点特殊标记
        const center = fromType ? item.to : item.from;
        const fromCode = center.code;
        const fromName = interceptCityName(center.name || '');
        let fromValues = [].concat(coord[fromCode !== undefined ? fromCode : fromName]);
        fromValues.push(center.value);
        const fromScatter = {
          name: scatterIntercept?fromName:center.name || '',
          value: fromValues,
          label: merge({
            show: false
          }, (center.series && center.series.label) || {}),
          itemStyle: {
            color: RED
          },
          tooltip: {
            show: false
          }
        };
        scatterDataList.unshift(fromScatter);
        seriesConfig[0].name = item.name || '';
        seriesConfig[0].data = flyDataList;
        seriesConfig[1].name = item.name || '';
        seriesConfig[1].data = scatterDataList;
        series.push(seriesConfig[0], seriesConfig[1]);
      }
      config.legend.data = legendData;
      this.chart.config = config;
      this.chart.series = series;

      if (this.data && this.data.length > 0 && this.other.click === true) {
        //setGeoArea 
        const item = isArray(this.data[0].from) ? this.data[0].to : this.data[0].from;
        setTimeout(() => {
          const { echartObj } = this.$refs.geo.getChart();
          this.clickMap();
          this.setGeoArea(echartObj,item.name);
        }, 100);
      }
    },
    getFlyDataList(data, to, coord, intercept) {
      const toName = interceptCityName(to.name);
      const toCode = to.code;
      return data.map((item) => {
        const fromName = interceptCityName(item.name);
        const fromCode = item.code;
        return {
          fromName: intercept === true ? fromName : item.name,
          toName: intercept === true ? toName : to.name,
          coords:[(fromCode !== undefined ? coord[fromCode] : coord[fromName]) || [], (toCode !== undefined ? coord[toCode] : coord[toName]) || []],
          value:item.value||0
        };
      });
    },
    getScatterDataList(data, coord, unit, intercept) {
      return data.map((item) => {
        const name = interceptCityName(item.name);
        const code = item.code;
        let values =merge([], [].concat(code !== undefined ? coord[code] : coord[name]));
        values.push(item.value || 0);
        // 设置散点数据
        return {
          name: intercept === true ? name : item.name,
          value: values,
          tooltip: {
            formatter: (v) => {
              return `${v.name}: ${v.value[2]}${unit}`
            }
          }
        };
      });
    },
    setGeoArea(echartObj, name) {
      echartObj.dispatchAction({
        type: 'geoUnSelect',
        dataIndex: 0,
      });
      echartObj.dispatchAction({
        type: 'geoSelect',
        dataIndex: 0,
        name,
      });
    },
    clickMap() {
      setTimeout(() => {
        const obj = this.$refs.geo.getChart();
        obj.echartObj.off('click');
        obj.echartObj.on('click', (item) => {
          this.changeGeo({
            name: item.name,
          });
          const currentItem = this.findItem(item);
          if (currentItem !== undefined) {
            this.setGeoArea(obj.echartObj, item.name);
          }
        })
      }, 100);
    },
    findItem(item = { name: '' }) {
      let data;
      if (this.data && this.data.length > 0) {
        for (let i = 0; i < this.data.length; i++) {
          const obj = this.data[i];
          const from = isArray(obj.from);
          const to = isArray(obj.to);
          data = (from === false ? [obj.from] : obj.from).find((f) => {
            return f.name === item.name;
          });
          if (data === undefined) {
            data = (to === false ? [obj.to] : obj.to).find((t) => {
              return t.name === item.name;
            });
          }
          if (data !== undefined) {
            break;
          }
        }
      }
      return data;
    },
    changeGeo(item) {
      const data = this.findItem(item);
      if (data !== undefined) {
        this.$emit('changeGeo', data);
      }
    }
  }
}


</script>

