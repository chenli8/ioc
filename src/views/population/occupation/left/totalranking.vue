<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <Growth :class="$style[`${clsPrefix}${clsName}-growthCon`]" v-for="(item,index) in topList" :key="index" :number="item.number" :unit="item.unit" :dis="item.dis" :title="item.countyName" :chartData="item.chartData" :chartConfig="item.chartConfig"></Growth>
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
    GREENCOLORS,
    BLUECOLORS
  } from "@/business-component/chart/chart.config.js";
  import {
    toFixed,
    units
  } from "@/lib/util.js";
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import Growth from "@/business-component/growth/index.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  export default {
    data() {
      return {
        clsName: 'totalranking',
        title: '各区县跨区职住人口总量排名TOP5',
        topList: []
      }
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      Growth,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.workLive.init,
        countyFlowWorkLive: state => state.workLive.countyFlowWorkLive,
      })
    },
    watch: {
      countyFlowWorkLive: function() {
        this.formatData(this.countyFlowWorkLive)
      },
    },
    methods: {
      formatData(data) {
        if (data && data.length > 0) {
          let workDataList = [];
          let liveDataList = [];
          data.forEach(item => {
            const name = item.countyName;
            workDataList.push({
              label: name,
              name1: name,
              value1: (item.workInflowPopulation || 0)
            });
            liveDataList.push({
              label: name,
              name1: name,
              value1: (item.liveInflowPopulation || 0)
            });
          });
  
          workDataList.sort((a, b) => {
            return (a.value || 0) - (b.value || 0);
          });
          liveDataList.sort((a, b) => {
            return (a.value || 0) - (b.value || 0);
          });
          //set top
          const topResident = workDataList[0];
          const topChain = liveDataList[0];
          const pre = "TOP1";
          this.topList = [{
              countyName: pre + topResident.label,
              number: toFixed(topResident.value1, 1),
              unit: units[2],
              dis: "工作人口流入总量",
              chartData: workDataList.slice(0, 5).reverse(),
              chartConfig: {
                other: {
                  series: [{
                    label: {
                      unit: ""
                    },
                  }]
                },
                grid: {
                  right: "20%"
                }
              }
            },
            {
              countyName: pre + topChain.label,
              number: toFixed(topChain.value1, 1),
              unit: units[2],
              dis: "居住人口流入总量",
              chartData: liveDataList.slice(0, 5).reverse(),
              chartConfig: {
                other: {
                  series: [{
                    label: {
                      unit: ""
                    },
                  }]
                },
                color: GREENCOLORS,
                grid: {
                  right: "20%"
                }
              }
            }
          ];
        }
      }
    },
    mounted() {
      if (this.init === true) {
        this.formatData(this.countyFlowWorkLive)
      }
    },
    beforeDestroy() {}
  }
</script>

<style module lang="less">
  @import "./totalranking.less";
</style>
