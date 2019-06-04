<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-border`]"></div>
    <div :class="$style[`${clsPrefix}${clsName}-transverse`]"></div>
    <div :class="$style[`${clsPrefix}${clsName}-info`]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
export default {
  data() {
    return {
      clsName: 'borderBg'
    }
  },
  mixins: [clsMixin]
}
</script>

<style module lang='less'>
@import "./index.less";
</style>
