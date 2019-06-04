<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <HorizontalBar :data="chart.data" :config="chart.config" :other="chart.other" :class="$style[`${clsPrefix}${clsName}-chart`]"></HorizontalBar>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import {
    createChartTemp,
    convertArrayData
  } from "@/lib/util.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "countyContrast",
        title: "各街镇通勤距离排名TOP 10",
        chart: createChartTemp({
          grid: {
            right: "12%"
          },
          tooltip: {
            show: false
          }
        }, [], {
          shadow: {
            show: true,
            label: {
              rich: {
                label: {
                  color: "rgba(153 ,213 ,250,.5)",
                },
                num: {
                  width: 30,
                  color: "#A5DCFF",
                },
              }
            }
  
          },
          series: []
        })
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
        init: state => state.commuting.init,
        streetCommuting: state => state.commuting.streetCommuting
      })
    },
    watch: {
      streetCommuting: function() {
        this.formateData(this.streetCommuting);
      }
    },
    mounted() {
      if (this.init === true || this.streetCommuting.length > 0) {
        this.formateData(this.streetCommuting);
      }
    },
    methods: {
      formateData(data = []) {
        if (data.length > 0) {
          const dataList = convertArrayData(
              data, {
                nameKeys: ["countyName"],
                valueKeys: ["averageDistance"]
              }, {
                label: "name",
                countyName: "countyName",
                averageDistance: "averageDistance"
              }
            )
            .slice(0, 10)
            .reverse();
  
          this.chart.other.shadow.formatter = par => {
            const countyName = dataList[par.dataIndex].countyName;
            const averageDistance = dataList[par.dataIndex].averageDistance;
            return `{num|${averageDistance}}  {label|${countyName}}`;
          };
          delete this.chart.config.color;
          this.chart.data = dataList;
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
  @import "./countyContrast.less";
</style>
