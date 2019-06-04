<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <PopularInflow></PopularInflow>
    <PopularRank></PopularRank>
  </div>
</template>
<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import PopularInflow from './popularInflow.vue';
import PopularRank from './popularRank.vue';
export default {
  data() {
    return {
      clsName: 'inflow-workerForce-right',
    }
  },
  mixins: [clsMixin],
  components: { PopularInflow, PopularRank }
}
</script>
<style module lang='less'>
@import "./index.less";
</style>
