<template>
  <div id="app" class="i-app" :class="isHead?'jd-ioc':''">
    <SideMenu :menuList="menuList"></SideMenu>
    <router-view></router-view>
  </div>
</template>

<script>
import SideMenu from '@/business-component/sideMenu/index.vue';
import { debounce, autoSize } from '@/lib/util.js';
export default {
  name: 'app',
  data() {
    return {
      isHead: true,
      menuList: [{
        "title": "人口运行总览",
        path: '/'
      },
      {
        "title": "人口总量分析",
        path: '/totalPopulation'
      },
      {
        "title": "人口构成分析",
        path: '/composition'
      },
      {
        "title": "人口跨区职住",
        path: '/occupation'
      },
      {
        "title": "城市通勤分析",
        path: '/citycommute'
      },
      {
        "title": "常住人口流动",
        path: '/permanentPopulation'
      },
      {
        "title": "劳动力人口流动",
        path: '/workerForce'
      },
      {
        "title": "人口来源地",
        path: '/source'
      },
      ],
    }
  },
  components: {
    SideMenu
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      document.body.style.width = `${process.env.VUE_APP_SCREEN_WIDTH}px`;
      document.body.style.height = `${process.env.VUE_APP_SCREEN_HEIGHT}px`;
      //判断是否为52.82.73.253不需要扩充头部
      if (location.href.indexOf('52.82.73.253') > -1) {
        this.isHead = false;
      } else {
        this.isHead = true;
      }
      autoSize();
      window.onresize = debounce(autoSize);
    }
  },
  beforeDestroy() {
    window.onresize = null;
  }
}
</script>

<style>
@import "./assets/css/base.css";
</style>


