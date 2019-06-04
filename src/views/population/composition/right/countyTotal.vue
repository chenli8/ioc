<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle="countyName"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-sexCon`]">
          <InfoBlock :class="$style[`${clsPrefix}${clsName}-sexDes`]" :number="urbanRate" :dis="urbanRateLabel"></InfoBlock>
        </div>
        <PieChart :config="chart.config" :data="chart.data" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-piechart`]"></PieChart>
      </div>
    </BorderBg>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from "vuex";
  import {
    createChartTemp,
    units,
    toFixed
  } from "@/lib/util.js";
  import {
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import hexToRgba from "@/lib/hexToRgba.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import PieChart from "@/business-component/chart/pieChart.vue";
  import InfoBlock from "@/business-component/infoBlock/index.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "countyTotal",
        title: "人口性别构成",
        urbanRate: 0,
        urbanRateLabel: '性别比',
        chart: createChartTemp({
          tooltip: {
            show: true
          },
          legend: {
            show: false
          }
        }, [], {
          series: [{
            radius: ["12%", "43%"],
            center:["0%","0%"],
            label: {
              show: true,
              unit: units[0]
            }
          }]
        })
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      PieChart,
      InfoBlock,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.populationStructure.init,
        countyName: state => state.cityInfo.countyName
      }),
      ...mapGetters([
        'countyStructureItem'
      ])
    },
    watch: {
      countyName: function() {
        this.formatData(this.countyStructureItem);
      },
      countyStructureItem: function() {
        this.formatData(this.countyStructureItem);
      }
    },
    mounted() {
      if (this.init === true || Object.keys(this.countyStructureItem).length > 0) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.countyStructureItem);
      },
      formatData(data = {}) {
        if (data && Object.keys(data).length > 0 && this.countyName) {
          let dataList = {
            name1: "男性",
            value1: data.maleRate,
            name2: "女性",
            value2: data.femaleRate
          };
          delete this.chart.config.color;
          this.chart.other.series = [{
            label: {
              show: true,
              unit: units[0]
            },
            radius: ["30%", "43%"],
          }];
          this.chart.data = [dataList];
          this.urbanRate = toFixed((data.maleRate / data.femaleRate) * 100, 2);
        } else {
          let dataList = {
            name1: "",
            value1: 0
          };
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.chart.other.series = [{
            label: {
              show: false
            }
          }];
          this.chart.data = [dataList];
          this.urbanRate = 0;
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./countyTotal.less";
</style>
