<template>
  <div class="backface" :class="$style[`${clsPrefix}${clsName}`]">
    <div :class="$style[`${clsPrefix}${clsName}-con`]">
      <div :class="$style[`${clsPrefix}${clsName}-line`]"></div>
      <template v-for="(item,index) in data">
        <span
          :class="[$style[`${clsPrefix}${clsName}-icon`],val===item.value?$style[`${clsPrefix}${clsName}-icon-active`]:'']"
          :key="index"
          :style="{left:`${index===0?5:getLeft(index)}%`}"
          @click="click(item,index)"
        ></span>
        <span
          :class="[$style[`${clsPrefix}${clsName}-label`],val===item.value?$style[`${clsPrefix}${clsName}-label-active`]:'']"
          :key="index+10"
          :style="{left:index===0?0:`calc(${getLeft(index)}% - 20px)`}"
        >{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import clsMixin from '@/business-component/mixins/clsMixin.js';
export default {
  props: {
    data: {
      type: Array,
      default: () => { return [] },
    },
    value: {
      type: String,
      default:''
    },
    play: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Number,
      default: 15000
    }
  },
  data() {
    return {
      clsName: 'timeline',
      val: '',
      timer: null
    }
  },
  mixins: [clsMixin],
  watch: {
    'data': function () {
      this.setData(this.data);
    },
    'value': function () {
      this.setValue(this.value);
    }
  },
  mounted() {
  },
  methods: {
    setData(data) {
      this.setValue(data.length ? data[0] : '');
    },
    setValue(data) {
      this.val = data? data : this.data.length ? this.data[0].value||'' : '';
      this.reset();
    },
    reset() {
      if (this.play) {
        this.stop();
        this.start();
      }
    },
    getLeft(index) {
      return ((90 / (this.data.length - 1)) * index);
    },
    click(item,index) {
      this.val = item.value;
      this.$emit('changeTime', item);
      if (this.play) {
        this.stop();
        //+1从下一个开始播放
        this.start(index + 1);
      }
    },
    start(dataIndex) {
      const dataLength = this.data.length;
      let count = dataIndex || 0;
      this.timer = setTimeout(() => {
        this.val = this.data[count % dataLength];
        this.$emit('changeTime', this.val);
        count++;
        this.start(count);
      }, this.speed || 15000);
    },
    stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  }, beforeDestroy() {
    this.stop();
  }
}
</script>

<style module lang='less'>
@import "./index.less";
</style>
