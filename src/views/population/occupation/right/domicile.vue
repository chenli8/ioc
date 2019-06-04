<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg>
      <HeaderBar :title="title" :subTitle="countyName" :index="2"></HeaderBar>
      <div :class="$style[`${clsPrefix}${clsName}-content`]">
        <HorizontalBar :config="horizontalBar.config" :data="horizontalBar.data" :other="horizontalBar.other" :class="$style[`${clsPrefix}${clsName}-horizontalBar`]"></HorizontalBar>
      </div>
    </BorderBg>
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState,
    mapGetters,
    mapActions
  } from 'vuex';
  
  import clsMixin from '@/business-component/mixins/clsMixin.js';
  import HeaderBar from '@/business-component/headerBar/index.vue';
  import HorizontalBar from "@/business-component/chart/horizontalBar.vue";
  import {
    createChartTemp,
    convertArrayData
  } from '@/lib/util.js';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: 'occu-domicile',
        title: '工作在的人都去哪里居住?',
        horizontalBar: createChartTemp({
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          grid: {
            right: '15%',
          },
          yAxis: [{
            axisLabel: {
              margin: 36
            }
          }],
          xAxis: [{
            max: 'dataMax',
          }]
        }, [], {
          shadow: {
            show: true,
            label: {
              distance: 18
            }
          }
        }),
      }
    },
    mixins: [clsMixin],
    components: {
      HeaderBar,
      HorizontalBar,
      BorderBg
    },
    computed: {
      ...mapState({
        countyName: state => state.cityInfo.countyName,
        countyLive: state => state.workLive.countyLive,
      })
    },
    watch: {
      countyLive: function() {
        this.formatData(this.countyLive);
      }
    },
    mounted() {
      if (this.countyLive.length > 0) {
        this.init();
      }
  
    },
    methods: {
      init() {
        this.formatData(this.countyLive);
      },
      formatData(data = []) {
        if (data.length > 0) {
          const dataList = convertArrayData(data, {
            nameKeys: ['countyName'],
            valueKeys: ['rate']
          }, {
            label: 'liveCountyName'
          });
          this.horizontalBar.data = dataList.reverse();
        } else {
          const dataList = Array(10).fill({
            'name1': '',
            'value1': 10,
            'label': ''
          });
          this.horizontalBar.data = dataList;
        }
      }
    },
    beforeDestroy() {}
  }
</script>

<style module lang="less">
  @import "./domicile.less";
</style>
