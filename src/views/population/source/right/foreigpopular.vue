
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :index="2"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-sideMap`]" v-for="(item,index) in chartDataList" :key="index">
          <PieBlock :cityName="item.name1" :ranking="item.name2" :percent="item.value1" :chartData="item"></PieBlock>
        </div>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import {
    convertArrayData,
    merge,
    toFixed
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import PieBlock from "@/business-component/pieBlock/index.vue";
  import hexToRgba from "@/lib/hexToRgba.js";
  import {
    REDCOLORS,
    BLUECOLORS,
    GREENCOLORS,
    YELLOWCOLORS
  } from "@/business-component/chart/chart.config.js";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "foreigpopular",
        title: "各区县省外外来人口排名TOP4",
        chartDataList: []
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      PieBlock,
      BorderBg
    },
    mounted() {
      if (this.init === true || this.countySource.length > 0) {
        this.formatData(this.countySource);
      }
    },
    computed: {
      ...mapState({
        init: state => state.populationSource.init,
        countySource: state => state.populationSource.countySource,
      })
    },
    watch: {
      countySource: function() {
        this.formatData(this.countySource);
      }
    },
    methods: {
      formatData(data = []) {
        if (data.length > 0) {
          const dataList = convertArrayData(
            data, {
              nameKeys: ["name", "inflowExternalRanking"],
              valueKeys: ["inflowExternalRate"]
            }
          ).sort((a, b) => {
            return a.name2 - b.name2;
          }).slice(0, 4);
          dataList.map((item, index) => {
            item.value1 = toFixed(item.value1, 1);
            if (index === 0) {
            item.config = {
              color: BLUECOLORS.concat([
                hexToRgba(BLUECOLORS[0], 0.3),
                hexToRgba(BLUECOLORS[1], 0.3)
              ])
            };
          }
            if (index === 1) {
              item.config = {
                color: GREENCOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              };
            }
  
            if (index === 2) {
              item.config = {
                color: REDCOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              };
            }
  
            if (index === 3) {
              item.config = {
                color: YELLOWCOLORS.concat([
                  hexToRgba(BLUECOLORS[0], 0.3),
                  hexToRgba(BLUECOLORS[1], 0.3)
                ])
              };
            }
          });
          this.chartDataList = dataList;
        }
      }
    }
  };
</script>

<style module lang="less">
  @import "./foreigpopular.less";
</style>