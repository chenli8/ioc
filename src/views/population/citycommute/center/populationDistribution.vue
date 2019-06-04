<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle='countyName' ></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <div :class="$style[`${clsPrefix}${clsName}-leftCon`]">
          <div :class="[$style[`${clsPrefix}${clsName}-des`],$style[`${clsPrefix}${clsName}-firstDes`]]">
            <div>
              <span>平均通勤距离</span>
              <div :class="$style[`${clsPrefix}${clsName}-desNum`]">
                <span :class="$style[`${clsPrefix}${clsName}-bolder`]">{{averageDistance}}</span>公里</div>
            </div>
            <div>
              <span>全市排名</span>
              <div :class="[$style[`${clsPrefix}${clsName}-desNum`],$style[`${clsPrefix}${clsName}-rakingNum`]]">
                <b :class="$style[`${clsPrefix}${clsName}-bolder`]">{{commuterDistanceRank}}/</b>{{childrenNum}}</div>
            </div>
          </div>
          <LegendPie :class="$style[`${clsPrefix}${clsName}-legendPie`]" :chartData='chartData'></LegendPie>
        </div>
        <div :class="$style[`${clsPrefix}${clsName}-rightCon`]">
          <div :class="[$style[`${clsPrefix}${clsName}-des`],$style[`${clsPrefix}${clsName}-rankingCon`]]">
            <div :class="$style[`${clsPrefix}${clsName}-subTitle`]">全区街道排名</div>
            <div>
              <span>第1名 {{firstStreet}}</span>
              <div :class="$style[`${clsPrefix}${clsName}-desNum`]">
                <span :class="$style[`${clsPrefix}${clsName}-bolder`]">{{firstDistance}}</span>公里</div>
            </div>
            <div>
              <span>最后1名 {{secondStreet}}</span>
              <div :class="$style[`${clsPrefix}${clsName}-desNum`]">
                <b :class="$style[`${clsPrefix}${clsName}-bolder`]">{{secondDistance}}</b>公里</div>
            </div>
          </div>
          <div :class="$style[`${clsPrefix}${clsName}-cityList`]">
            <div :class="$style[`${clsPrefix}${clsName}-cityItem`]" v-for="(item,index) in currentList" :key="index">
              <div :class="$style[`${clsPrefix}${clsName}-citynumber`]">0{{index+1}}</div>
              <div :class="$style[`${clsPrefix}${clsName}-cityname`]">{{item.name1}}</div>
              <div :class="$style[`${clsPrefix}${clsName}-cityrage`]">
                <Progress :percent="item.value2" :progressMax="progressMax"></Progress>
              </div>
              <div>
                <div :class="$style[`${clsPrefix}${clsName}-info`]">{{item.value2}}</div>
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
    mapGetters,
    mapMutations
  } from "vuex";
  import {
    convertArrayData,
    convertObjectData
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import Progress from "@/business-component/progress/index.vue";
  import LegendPie from "@/business-component/legendPie/index.vue";
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "populationDistribution",
        title: "平均通勤距离概况",
        currentList: [],
        chartData: [],
        progressMax: 0,
        commuterDistanceRank: 0,
        averageDistance: 0,
        firstStreet: '',
        firstDistance: 0,
        secondStreet: '',
        secondDistance: 0
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      Progress,
      LegendPie,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.commuting.init,
        streetFencing: state => state.cityInfo.streetFencing,
        countyName: state => state.cityInfo.countyName,
        streetName: state => state.cityInfo.streetName,
        childrenNum: state => state.cityInfo.childrenNum,
      }),
      ...mapGetters(["countyCommutingItem", 'streetCommutingOfCounty'])
    },
    watch: {
      countyCommutingItem: function() {
        this.formatCountyData(this.countyCommutingItem);
      },
      countyName: function() {
        this.formatCountyData(this.countyCommutingItem);
      },
      streetName: function() {
        this.formatStreetData(this.streetCommutingOfCounty);
      },
      streetCommutingOfCounty: function() {
        this.formatStreetData(this.streetCommutingOfCounty);
      },
    },
    mounted() {
      if (this.init === true || (Object.keys(this.countyCommutingItem).length > 0 || this.streetCommutingOfCounty.length > 0)) {
        this.formatCountyData(this.countyCommutingItem);
        this.formatStreetData(this.streetCommutingOfCounty);
      }
    },
    methods: {
      ...mapMutations(["setStreet"]),
      formatCountyData(data = {}) {
        let dataList = [];
        if (Object.keys(data).length > 1) {
          this.averageDistance = data.averageDistance;
          this.commuterDistanceRank = data.commuterDistanceRank;
          const _data = convertObjectData(data, {
            nameKeys: ["aName", "bName", "cName", "dName", "eName"],
            valueKeys: ["aRate", "bRate", "cRate", "dRate", "eRate"]
          });
          dataList.push(_data);
  
          this.chartData = dataList;
        }
      },
      formatStreetData(data = []) {
        if (data.length > 0) {
          const dataList = convertArrayData(data, {
            nameKeys: ['name', ''],
            valueKeys: ['', 'averageDistance']
          })
          this.firstStreet = dataList[0].name1;
          this.firstDistance = dataList[0].value2;
          this.secondStreet = dataList[dataList.length - 1].name1;
          this.secondDistance = dataList[dataList.length - 1].value2;
          this.currentList = dataList.slice(0, 5);
          this.progressMax = this.currentList[0].value2;
        } else {
          const dataList = Array(5).fill({
            'name1': '',
            'value1': 10,
            'label': ''
          });
          this.currentList = dataList.reverse();
        }
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./populationDistribution.less";
</style>
