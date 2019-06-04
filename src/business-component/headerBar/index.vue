<template>
  <div class='backface'
    :class="[$style[`${clsPrefix}${clsName}`], transparent?$style[`${clsPrefix}${clsName}-transparent`]:'',cls]"
  >
    <img v-if="iconShow" :class="$style[`${clsPrefix}${clsName}-icon`]" :src="icon">
    <span>{{prefix}}</span>
    <span :class="$style[`${clsPrefix}${clsName}-subtitle`]">{{subTitle}}</span>
    <span>{{suffix}}</span>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: require('@/assets/images/ico-security.png')
    },
    iconShow: {
      type: Boolean,
      default: true
    },
    subTitle: {
      type: String,
      default: ''
    },
    transparent: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      clsName: 'headerBar',
      prefix: '',
      suffix: ''
    };
  },
  mixins: [clsMixin],
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.index) {
        const nextIndex = this.index + 1;
        this.prefix = this.title.substring(0, nextIndex);
        this.suffix = this.title.substring(nextIndex, this.title.length)
      } else {
        this.suffix = this.title;
      }
    }
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>
