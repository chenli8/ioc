<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <inflowMap></inflowMap>
    <RankingSources></RankingSources>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import inflowMap from './inflowMap.vue';
import RankingSources from './rankingSources.vue';
export default {
  data() {
    return {
      clsName: 'population-center-con'
    }
  },
  mixins: [clsMixin],
  components: { RankingSources, inflowMap },
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
