
<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title" :index="2"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <div
        :class="$style[`${clsPrefix}${clsName}-sideMap`]"
        v-for="(item,index) in chartDataList"
        :key="index"
      >
        <PieBlock
          :cityName="item.name1"
          :ranking="item.name2"
          :percent="item.value1"
          :chartData="item"
          :chartCls="$style[`${clsPrefix}${clsName}-chart`]"
        ></PieBlock>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { convertArrayData, merge,toFixed } from "@/lib/util.js";
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
export default {
  data() {
    return {
      clsName: "popularTop",
      title: "各区县外来人口排名TOP4",
      chartDataList: []
    };
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    PieBlock
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
    if (this.init === true||this.countySource.length>0) {
      this.formatData(this.countySource);
    }
  },
  methods: {
    formatData(data = []) {
      if (data.length > 0) {
        const dataList = convertArrayData(data, {
          nameKeys: ["name", "inflowRanking"],
          valueKeys: ["inflowRate"]
        }).sort((a, b) => {
          return b.value1 - a.value1;
        }).slice(0, 4);
        
        dataList.map((item, index) => {
          item.name2=(index+1);
          item.value1=toFixed(item.value1,1);
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
@import "./popularTop.less";
</style>