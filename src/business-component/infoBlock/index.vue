<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-info`]">
      <div v-show="position === 'top'">{{dis}}</div>
      <div :class="$style[`${clsPrefix}${clsName}-numCon`]">
        <span :class="$style[`${clsPrefix}${clsName}-num`]">{{number}}</span>
        <span>{{unit}}</span>
      </div>
      <div v-show="position === 'bottom'">{{dis}}</div>
    </div>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
export default {
  props: {
    number: {
      type: [Number,String],
      default: '',
    },
    unit: {
      type: String,
      default: ''
    },
    dis: {
      type: String,
      default: ''
    },
    position:{
      type: String,
      default: 'top'
    }

  },
  data() {
    return {
      clsName: 'infoBlock'
    }
  },
  mixins: [clsMixin]
}
</script>

<style module lang='less'>
@import "./index.less";
</style>
