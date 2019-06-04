<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <BorderBg :class="$style[`${clsPrefix}${clsName}-content`]">
      <div :class="$style[`${clsPrefix}${clsName}-fireBox`]">
        <ScatterPlot></ScatterPlot>
      </div>
    </BorderBg>
    <BorderBg>
      <div :class="$style[`${clsPrefix}${clsName}-fireBox`]">
        <PopularTop></PopularTop>
      </div>
    </BorderBg>
  
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import {
    convertObjectData
  } from "@/lib/util.js";
  import clsMixin from "@/business-component/mixins/clsMixin.js";
  import HeaderBar from "@/business-component/headerBar/index.vue";
  import PopularTop from './popularTop.vue';
  import ScatterPlot from './scatterPlot.vue';
  import BorderBg from '@/business-component/borderBg/index.vue';
  
  export default {
    data() {
      return {
        clsName: "rankingSources"
      };
    },
    computed: {
      ...mapState({})
    },
    watch: {},
    mixins: [clsMixin],
    components: {
      HeaderBar,
      PopularTop,
      ScatterPlot,
      BorderBg
    },
    mounted() {},
    methods: {
      formatData() {
  
      }
    },
    beforeDestroy() {}
  };
</script>

<style module lang="less">
  @import "./rankingSources.less";
</style>
