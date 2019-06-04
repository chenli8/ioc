<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-cityCon`]">
        <div :class="$style[`${clsPrefix}${clsName}-cityList`]">
          <div :class="$style[`${clsPrefix}${clsName}-cityItem`]" v-for="(item,index) in currentList" :key="index">
            <div :class="$style[`${clsPrefix}${clsName}-citynumber`]">{{index+1}}</div>
            <div :class="$style[`${clsPrefix}${clsName}-cityname`]">{{interceptCityName(item.name1)}}</div>
            <div :class="$style[`${clsPrefix}${clsName}-cityrage`]">
              <Progress :percent="item.value2" :progressMax="progressMax"></Progress>
            </div>
            <div>
              <div :class="$style[`${clsPrefix}${clsName}-info`]">{{item.value2}}%</div>
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
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "foreignCity",
        title: "全市人口外来城市TOP30",
        progressMax: 0,
        currentList: []
      };
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      Progress,
      BorderBg
    },
    computed: {
      ...mapState({
        init: state => state.populationSource.init,
        citySourceList: state => state.populationSource.citySourceList
      })
    },
    watch: {
      citySourceList: function() {
        this.formatData(this.citySourceList);
      }
    },
    mounted() {
      if (this.init === true) {
        this.initData();
      }
    },
    methods: {
      initData() {
        this.formatData(this.citySourceList);
      },
      formatData(data = []) {
        let list = [];
        if (this.citySourceList.length > 0) {
          list = convertArrayData(data, {
            nameKeys: ["sourceName"],
            valueKeys: ["inflowPopulation", "inflowRate"]
          });
          this.currentList = list;
          this.progressMax = this.currentList[0].value2;
        }
      },
      interceptCityName(name) {
        return interceptCityName(name);
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./foreignCity.less";
</style>
