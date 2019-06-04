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
    formatThousands,
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
        clsName: 'cityranking',
        title: '各区县工作/居住人口排名TOP5',
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
        countyPopulation: state => state.totalPopulation.countyPopulation,
      })
    },
    watch: {
      countyPopulation: function(newData, older) {
        this.formatData(this.countyPopulation)
      },
    },
    methods: {
      formatData(data = []) {
        if (data && data.length > 0) {
          let workDataList = [];
          let liveDataList = [];
          data.forEach(item => {
            const name = item.countyName;
            workDataList.push({
              label: name,
              name1: name,
              value1: formatThousands(item.workPopulation || 0)
            });
            liveDataList.push({
              label: name,
              name1: name,
              value1: formatThousands(item.livePopulation || 0)
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
              unit: units[1],
              dis: "工作人口",
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
              unit: units[1],
              dis: "居住人口",
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
    mounted() {},
    beforeDestroy() {}
  }
</script>

<style module lang="less">
  @import "./cityranking.less";
</style>
