<template>
  <div 
  :style="'margin-top:-'+sideMenuHeight+'px'"
  :class="[$style[`${clsPrefix}${clsName}`],flug ? '': $style[`${clsPrefix}${clsName}-hide`]]" ref='sideMenu'>
    <div :class="$style[`${clsPrefix}${clsName}-menuCon`]">
      <a v-for="(item,index) in menuList" :key='index'  :class="[$style[`${clsPrefix}${clsName}-item`],current==index ? $style[`${clsPrefix}${clsName}-active`] : '']" @click="gotoPage(item,index)">{{item.title}}</a>
    </div>
    <div :class="$style[`${clsPrefix}${clsName}-btn`]" @click="drawSideMenu">
      <i v-show="flug" :class="$style[`${clsPrefix}${clsName}-arrowRight`]"> </i>
      <i v-show="!flug" :class="$style[`${clsPrefix}${clsName}-arrowLeft`]"> </i>
    </div>
  </div>
</template>

<script>
import clsmixin from "@/business-component/mixins/clsMixin.js";
export default {
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      clsName: "sideMenu",
      flug: true,
      current: 0,
      sideMenuHeight: 0
    };
  },
  mixins: [clsmixin],
  methods: {
    gotoPage(data, index) {
      this.current = index;
      this.$router.push(data.path);
    },
    drawSideMenu(flug) {
      this.flug = !this.flug;
    },
    init() {
      const sideMenu = this.$refs.sideMenu;
      const sideMenuStyle = document.defaultView.getComputedStyle(
        sideMenu,
        null
      );
      const sideMenuHeight = Number(sideMenuStyle.height.split("p")[0]) / 2;
      this.sideMenuHeight = sideMenuHeight;
    }
  },
  mounted() {
    this.init();
    const currentUrl =window.location.hash|| window.location.pathname;
    this.menuList.map((item, index) => {
      if (currentUrl.indexOf(item.path)>-1) {
        this.current = index;
      }
    });
  }
};
</script>

<style module lang='less'>
@import "./index.less";
</style>

