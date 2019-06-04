<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg
       v-for="(item,index) in chartData.length"
       :key="index"
       :class="$style[`${clsPrefix}${clsName}-content`]"
    >
      <RankingPie
      :class="$style[`${clsPrefix}${clsName}-chart`]"
      :chartData="chartData[index]"
      :siblingsNum="siblingsNum"
    ></RankingPie> 
    </BorderBg>
   
  </div>
</template>

<script>
import {
  mapState
} from 'vuex';
import {
  convertObjectData,
  formatThousands
} from "@/lib/util.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import RankingPie from "@/business-component/rankingPie/rankingPie.vue";
import BorderBg from '@/business-component/borderBg/index.vue';
export default {
  data() {
    return {
      clsName: "rankingSources",
      chartData: []
    };
  },
  computed: {
    ...mapState({
      init: state => state.residentFlow.init,
      cityResidentFlowTotal: state => state.residentFlow.cityResidentFlowTotal,
      siblingsNum: state => state.cityInfo.siblingsNum
    })
  },
  watch: {
    cityResidentFlowTotal: function () {
      this.formatData(this.cityResidentFlowTotal);
    }
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    RankingPie,
    BorderBg
  },
  mounted() {
    if (this.init === true) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.formatData(this.cityResidentFlowTotal);
    },
    formatData(data={}) {
      const list = [{
        'title': "常住流入人口排名与来源",
        'totalName': "流入人口总量",
        'unit': "万人",
        'ranking': 0,
        'total': 0,
        'inflowData': []
      },
      {
        'title': "常住流出人口排名与去向",
        'totalName': "流出人口总量",
        'total': 0,
        'unit': "万人",
        'ranking': 0,
        'inflowData': []
      },
      {
        'title': "常住净流入人口排名与来源",
        'totalName': "净流入人口总量",
        'total': 0,
        'unit': "万人",
        'ranking': 0,
        'inflowData': []
      }
      ];
      list.map((item, index) => {
        if (index === 0) {
          item.ranking = data.inflowRanking || 0;
          item.total = formatThousands(data.inflowTolal) || 0;
          item.inflowData = convertObjectData(data,[{nameValues:['省内','省外'],valueKeys:['inflowLocalRate','inflowExternalRate']}]);
        }
        if (index === 1) {
          item.ranking = data.outflowRanking || 0;
          item.total = formatThousands(data.outflowTolal) || 0;
          item.inflowData =convertObjectData(data,[{nameValues:['省内','省外'],valueKeys:['outflowLocalRate','outflowExternalRate']}]);
        }
        if (index === 2) {
          item.ranking = data.netInflowRanking || 0;
          item.total = formatThousands(Math.abs(data.netInflowTolal)) || 0;
          item.title = item.total >= 0 ? '常住净流入人口排名与来源' : '常住净流入人口排名与去向';
          item.inflowData =convertObjectData(data,[{nameValues:['省内','省外'],valueKeys:['netInflowLocalRate','netInflowExternalRate']}]);
        }
      })
      this.chartData = list;
    }
  },
  beforeDestroy() { }
};
</script>

<style module lang="less">
@import "./rankingSources.less";
</style>
