<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
<HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <subNav :navList="navList" :currentNav="currentNav" @changeNav="switchNavHandlefun"></subNav>
      <div :class="$style[`${clsPrefix}${clsName}-cityCon`]">
        <ul :class="$style[`${clsPrefix}${clsName}-subCon`]">
          <li :class="$style[`${clsPrefix}${clsName}-subTitle`]">城市名称</li>
          <li :class="$style[`${clsPrefix}${clsName}-subTitle`]">{{navList[currentNav].name}}人口(人)</li>
          <li :class="$style[`${clsPrefix}${clsName}-subTitle`]">{{navList[currentNav].name}}占比(%)</li>
        </ul>
        <div :class="$style[`${clsPrefix}${clsName}-cityList`]">
          <div
            :class="$style[`${clsPrefix}${clsName}-cityItem`]"
            v-for="(item,index) in currentList"
            :key="index"
          >
            <div
              :class="[$style[`${clsPrefix}${clsName}-citynumber`],
                          index===0 ? $style[`${clsPrefix}${clsName}-firstNumber`]:'',
                          index===1 ? $style[`${clsPrefix}${clsName}-secondNumber`]:'',
                          index===2 ? $style[`${clsPrefix}${clsName}-threeNumber`]:'',
                          ]"
            >{{index+1}}</div>
            <div
              :class="$style[`${clsPrefix}${clsName}-cityname`]"
            >{{interceptCityName(item.name1)}}</div>
            <div :class="$style[`${clsPrefix}${clsName}-citypopulation`]">{{item.value1}}</div>
            <div :class="$style[`${clsPrefix}${clsName}-cityrage`]">
              <Progress :percent="item.value2" :progressMax="progressMax"></Progress>
            </div>
            <div>
              <div :class="$style[`${clsPrefix}${clsName}-info`]">{{item.value2}}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </BorderBg>
    
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from "vuex";
import {
  convertArrayData,
  interceptCityName
} from "@/lib/util.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import Progress from "@/business-component/progress/index.vue";
import subNav from "@/business-component/subNav/subNav.vue";
import BorderBg from '@/business-component/borderBg/index.vue';

export default {
  data() {
    return {
      clsName: "popularInflow",
      title: "常住人口流动分析",
      progressMax: 0,
      currentNav: 0,
      navList: [{
        name: "流入",
        value: 0
      },
      {
        name: "流出",
        value: 1
      },
      {
        name: "净流入",
        value: 2
      }
      ],
      currentList: []
    };
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    Progress,
    subNav,
    BorderBg
  },
  computed: {
    ...mapState({
      init: state => state.residentFlow.init,
      cityResidentFlowList: state => state.residentFlow.cityResidentFlowList
    })
  },
  watch: {
    cityResidentFlowList: function () {
      this.formatData(this.cityResidentFlowList);
    }
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
  },
  methods: {
    ...mapMutations(["setCityResidentFlowType"]),
    initData() {
      this.setCityResidentFlowType(this.currentNav);
      this.formatData(this.cityResidentFlowList);
    },
    formatData(data = []) {
      let list = [];
      if (data.length > 0) {
        if (this.currentNav === this.navList[0].value) {
          list = convertArrayData(data, {
            nameKeys: ["sourceName"],
            valueKeys: ["inflow", "inflowRatio", "inflowTolal"]
          });
          this.currentList = list.sort((a, b) => { return b.value1 - a.value1 }).slice(0, 30);
          this.progressMax = this.currentList[0].value2;
        } else if (this.currentNav === this.navList[1].value) {
          list = convertArrayData(data, {
            nameKeys: ["sourceName"],
            valueKeys: ["outflow", "outflowRatio", "outflowTolal"]
          });
          this.currentList = list.sort((a, b) => { return b.value1 - a.value1 }).slice(0, 30);
          this.progressMax = this.currentList[0].value2;
        } else {
          list = convertArrayData(data, {
            nameKeys: ["sourceName"],
            valueKeys: [
              "netInflow",
              "netInflowRatio",
              "netInflowTolal",
              "netOutflowTolal"
            ]
          });
          list.map(item => {
            if (item.value2 === Infinity) {
              item.value2 = 0
            }
          })
          list.sort((a, b) => { return b.value1 - a.value1 });
          this.currentList = list.slice(0, 15).concat(list.slice((list.length - 15), list.length));
          this.progressMax = this.currentList[0].value2;
        }
      }
    },
    switchNavHandlefun(current) {
      this.currentNav = current.value;
      this.formatData(this.cityResidentFlowList);
      this.setCityResidentFlowType(this.currentNav);
    },
    interceptCityName(name) {
      return interceptCityName(name);
    }
  },
  beforeDestroy() { }
};
</script>

<style module lang="less">
@import "./popularInflow.less";
</style>
