<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <li
      v-for="(item,i) in data"
      :class="[$style[`${clsPrefix}${clsName}-tabTitle`],i === index ? $style[`${clsPrefix}${clsName}-active`] : '']"
      :key="i"
      @click="changeTab(item,i)"
    >{{item.name}}</li>
  </div>
</template>

<script>
import clsMinxin from '../../business-component/mixins/clsMixin.js';
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      clsName: 'tabline',
      index: 0,
    };
  },
  mixins: [clsMinxin],
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const index = this.data.findIndex((item, index) => {
        return item.name === this.value;
      });
      this.index = index === -1 ? 0 : index;
    },
    changeTab(item, index) {
      this.index = index;
      this.$emit('change-tab', item)
    }
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
