
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title" :index="2"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <ScatterChart
        :data="chart.data"
        :config="chart.config"
        :other="chart.other"
        :class="$style[`${clsPrefix}${clsName}-chart`]"
      ></ScatterChart>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import clsMixin from '@/business-component/mixins/clsMixin.js';
import { createChartTemp, units, convertArrayData } from "@/lib/util.js";
import HeaderBar from '@/business-component/headerBar/index.vue';
import ScatterChart from '@/business-component/chart/scatterChart.vue';
export default {
  data() {
    return {
      clsName: 'scatterPlot',
      title: "各区县外来人口分布情况",
      chart: createChartTemp({
        grid: {
          right: '2%',
          bottom: '10%'
        },
        legend: {
          show: false
        },
        xAxis: [{
          scale: true,
          name: '省外外来占比',
          nameLocation: 'end',
          nameTextStyle: {
            padding: [0, 0, -60, -80]
          },
          axisLabel: {
            unit: units[0]
          },
        }],
        yAxis: [{
          scale: true,
          name: '外来人口占比',
          nameTextStyle: {
            padding: [0, 0, 8, 0]
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            unit: units[0]
          }
        }]
      }, [], {
          series: {
            label: {
              position:'top',
              unit: units[0],//此处可以有第二种配置为数组形式 unit:[units[0],units[1]]
              formatter: function (param) {
                return param.data[4];
              },
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                normal: {
                  type: 'solid'
                }
              },
              label: {
                show: false
              },
              data: [
                { type: 'average', valueIndex:0,lineStyle: { type: 'dotted' } },
                { type: 'average', valueIndex:1,lineStyle: { type: 'dotted' } }
              ]
            }
          }
        }),
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    ScatterChart
  },
  computed: {
    ...mapState({
      init: state => state.populationSource.init,
      countySource: state => state.populationSource.countySource
    })
  },
  watch: {
    countySource: function (newval, oldval) {
      this.formatData(this.countySource);
    }
  },
  mounted() {
    if (this.init === true || this.countySource.length > 0) {
      this.formatData(this.countySource);
    }
  },
  methods: {
    formatData(data = []) {
      let dataList = [];
      if (data.length > 0) {
        dataList = convertArrayData(
          data,
          {
            nameValues: ['省外外来占比','外来人口占比', ],
            valueKeys: ['inflowExternalRate','inflowRate' ]
          },
          {
            'label': 'name'
          }
        );

      } else {
        dataList = Array(1).fill(Array(2).fill({ 'name1': '', value1: 0, 'name2': '', value2: 0, 'label': '' }));
      }
      this.chart.data = [dataList];
    }
  }
};
</script>

<style module lang="less">
@import "./scatterPlot.less";
</style>