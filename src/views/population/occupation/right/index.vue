<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <Domicile></Domicile>
    <Workplace></Workplace>
    <WorkLiveRatio></WorkLiveRatio>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import Domicile from './domicile.vue';
import Workplace from './workplace.vue';
import WorkLiveRatio from './workLiveRatio.vue';
export default {
  data() {
    return {
      clsName: 'operation-home-right',
    }
  },
  mixins: [clsMixin],
  components: { Domicile, Workplace, WorkLiveRatio },

}
</script>

<style module lang='less'>
@import "./index.less";
</style>
