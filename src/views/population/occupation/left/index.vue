<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <Cityranking></Cityranking>
    <Totalranking></Totalranking>
    <Residential></Residential>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import Totalranking from './totalranking.vue';
import Cityranking from './cityranking.vue';
import Residential from './residential.vue';
export default {
  data() {
    return {
      clsName: 'population-left-con'
    }
  },
  mixins: [clsMixin],
  components: { Cityranking,Totalranking, Residential },
  mounted() {

  },
  methods: {
  },
  beforeDestroy() {
  }
}
</script>

<style module lang="less">
@import "./index.less";
</style>
