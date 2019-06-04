<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle='streetName' :index='2'></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <HorizontalBar :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></HorizontalBar>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState,
    mapActions
  } from "vuex";
  import {
    createChartTemp,
    convertArrayData
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import {
    BLUECOLORS,
    GREENCOLORS
  } from "@/business-component/chart/chart.config.js";
  import hexToRgba from "@/lib/hexToRgba.js";
  import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
  import {
    debug
  } from 'util';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "residentTrend",
        title: "居住在的人都去哪里工作？",
        chart: createChartTemp({
          color: GREENCOLORS,
          grid: {
            right: '15%'
          },
          tooltip: {
            show: false
          },
          xAxis: [{
            max: 'dataMax'
          }],
        }, [], {})
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      HorizontalBar,
      BorderBg
    },
    computed: {
      ...mapState({
        streetName: state => state.cityInfo.streetName,
        init: state => state.commuting.init,
        streetWork: state => state.commuting.streetWork
      })
    },
    watch: {
      streetWork: function() {
        this.formateData(this.streetWork);
      },
      streetName: function(newval, oldval) {
        if (Object.keys(oldval)) {
          this.updateStreetWork()
        }
      }
    },
    mounted() {
      if (this.init === true || this.streetWork.length > 0) {
        this.formateData(this.streetWork);
      }
    },
    methods: {
      ...mapActions(['updateStreetWork']),
      formateData(data) {
        if (data.length > 0) {
          const dataList = convertArrayData(
            data, {
              nameValues: ["rate"],
              valueKeys: ["rate"]
            }, {
              label: "targetName"
            }
          );
          this.chart.config.color = GREENCOLORS;
          this.chart.data = dataList.slice(0, 10).reverse();
        } else {
          const dataList = Array(10).fill({
            name1: "",
            value1: 10,
            label: ""
          });
          this.chart.config.color = [
            hexToRgba(BLUECOLORS[0], 0.3),
            hexToRgba(BLUECOLORS[1], 0.3)
          ];
          this.chart.data = dataList.reverse();
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./residentTrend.less";
</style>
