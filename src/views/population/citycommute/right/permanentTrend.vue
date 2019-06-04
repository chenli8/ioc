<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle='streetName' :index='2'></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <HorizontalBar :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-charts`]"></HorizontalBar>
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
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import hexToRgba from "@/lib/hexToRgba.js";
  import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "permanentTrend",
        title: "工作在的人都去哪里居住？",
        chart: createChartTemp({
          grid: {
            right: '15%'
          },
          tooltip: {
            show: false
          },
          xAxis: [
  
            {
              max: 'dataMax',
            }
          ],
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
        streetLive: state => state.commuting.streetLive
      })
    },
    watch: {
      streetLive: function() {
        this.formateData(this.streetLive);
      },
      streetName: function(newval, oldval) {
        if (Object.keys(oldval)) {
          this.updateStreetLive()
        }
      }
    },
    mounted() {
      if (this.init === true || this.streetLive.length > 0) {
        this.formateData(this.streetLive);
      }
    },
    methods: {
      ...mapActions(['updateStreetLive']),
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
          delete this.chart.config.color;
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
  @import "./permanentTrend.less";
</style>
