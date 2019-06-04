<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <p :class="$style[`${clsPrefix}${clsName}-subTitle`]">
          <span>全市男性占比</span>
          <span :class="[$style[`${clsPrefix}${clsName}-rate`],$style[`${clsPrefix}${clsName}-disMargin`]]">{{maleRate}}%</span>
          <span>女性占比</span>
          <span :class="$style[`${clsPrefix}${clsName}-rate`]">{{femaleRate}}%</span>
        </p>
        <LineBar :config='linebar.config' :data='linebar.data' :other='linebar.other' :class="$style[`${clsPrefix}${clsName}-linebar`]"></LineBar>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  import {
    convertArrayData,
    createChartTemp,
    toFixed,
    units
  } from '@/lib/util.js';
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import LineBar from '@/business-component/chart/lineBar.vue';
  import {
    BLUECOLORS
  } from '@/business-component/chart/chart.config.js';
  import hexToRgba from "@/lib/hexToRgba.js";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: 'cityTotal',
        title: '全市人口性别构成近10年趋势',
        linebar: createChartTemp({
          xAxis: [{
            axisLabel: {
              rotate: 60,
              interval: 0
            }
          }],
          yAxis: [{
            name: ''
          }, {
            min: function(value) {
              return Math.floor(value.min - 2);
            }
          }],
          tooltip: {
            show: true,
            formatter: function(v) {
              console.log(v, '1')
              return `${v[0].name}<br/>${v[0].seriesName}:${v[0].value}${units[0]}<br/>${v[1].seriesName}:${v[1].value}${units[0]}<br/>${v[2].seriesName}:${v[2].value}`
            }
          },
        }, [], {
        series: {
            barWidth: '55%',
            barGap: '10%'
          }
        }),
        maleRate: 0,
        femaleRate: 0
      }
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      LineBar,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.populationStructure.init,
        cityStructureTrend: state => state.populationStructure.cityStructureTrend
      })
    },
    watch: {
      cityStructureTrend: function() {
        this.formatData(this.cityStructureTrend);
      }
    },
    mounted() {
      if (this.init === true) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.cityStructureTrend);
      },
      formatData(data = {}) {
        if ((Object.keys(data)).length > 0) {
          //17年男女比例值
          this.maleRate = data[0].maleRate;
          this.femaleRate = data[0].femaleRate;
          const dataList = convertArrayData(data, {
            nameValues: ['男性', '女性', '性别比'],
            valueKeys: ['maleRate', 'femaleRate', 'sexRate'],
          }, {
            label: 'dateTime'
          });
          this.linebar.data = dataList.reverse();
          delete this.linebar.config.color;
          this.linebar.config.tooltip.show = true;
        } else {
          const dataList = Array(10).fill({
            name1: '',
            name2: '',
            name3: '',
            value1: 60,
            value2: 60,
            value3: 60,
          });
          this.linebar.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.linebar.config.tooltip = {
            show: false
          }
          this.linebar.data = dataList;
        }
      }
    },
    beforeDestroy() {},
  }
</script>

<style module lang="less">
  @import "./cityTotal.less";
</style>
