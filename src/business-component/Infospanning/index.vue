<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-soild`]"
     v-show="target !== 2"
    ></div>
    <div :class="$style[`${clsPrefix}${clsName}-info`]">
      <div :class="$style[`${clsPrefix}${clsName}-header`]">
          <span>{{key}}全市{{title}}({{units}})</span>
      </div>
      <div :class="$style[`${clsPrefix}${clsName}-center`]">
          <span :class="$style[`${clsPrefix}${clsName}-size`]">{{dis}}</span>
          <img :src="imgUrl" alt="" :class="$style[`${clsPrefix}${clsName}-img`]">
          <span :style="'color: '+ fontcolor">{{unit}}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
import top from '../../assets/images/jiantou_top.png'
import bottom from '../../assets/images/jiantou_bottom.png'

export default {
  props: {
        title: {
          type: String,
          default: '常住人口'
        },
        unit: {
          type: Number,
          default: 2.7
        },
        dis: {
          type: Number,
          default: 387.4
        },
        trend: {
            type: String,
            default: 'bottom'
        },
        units: {
          type: String,
          default: '万人'
        },
        target:{
          type: Number,
          default: 0
        }
  },
  data() {
    return {
      clsName: 'Infospanning',
      imgUrl: '',
        imgList: [top, bottom],
        fontcolor: ''
    }
  },
  mixins: [clsMixin],
    mounted() {
        this.initImg();
    },
    methods: {
        initImg () {
            if (this.trend == 'bottom') {
                this.imgUrl = this.imgList[1]
                this.fontcolor = '#75d9d1'
            } else if (this.trend == 'top') {
                this.imgUrl = this.imgList[0]
                this.fontcolor = '#ed7777'
            } else {
                this.imgUrl = this.imgList[1]
                this.fontcolor = '#ed7777'
            }
        }
    }
}
</script>

<style module lang='less'>
@import "./index.less";
</style>
