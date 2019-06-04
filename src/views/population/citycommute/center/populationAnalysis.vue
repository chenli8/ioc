<template>
  <div :class="$style[`${clsPrefix}${clsName}`]">
    <HeaderBar :title="title"></HeaderBar>
    <div :class="$style[`${clsPrefix}${clsName}-content`]">
      <SubNav :navList='navList' :currentNav='currentNav' :class="$style[`${clsPrefix}${clsName}-subNav`]" @changeNav='changeNav'></SubNav>
      <Select :seletList='seletList' 
              :class="$style[`${clsPrefix}${clsName}-select`]"
              @changeCurrentStreet='changeCurrentStreet'
              @changeCounty='changeCounty'
      ></Select>
      <div ref='allmap' :class="$style[`${clsPrefix}${clsName}-allmap`]"></div>
    </div>
  </div>
</template>

<script>
import inMap from "inmap";
import { mapState, mapMutations, mapGetters } from "vuex";
import { createChartTemp, formatThousands, units, merge } from "@/lib/util.js";
import axios from '@/lib/axios.js';
import { darkSkin } from "@/business-component/chart/chart.config.js";
import clsMixin from "@/business-component/mixins/clsMixin.js";
import HeaderBar from "@/business-component/headerBar/index.vue";
import SubNav from "@/business-component/subNav/subNav.vue";
import Select from "@/business-component/select/index.vue";
import { debug } from 'util';
export default {
  data() {
    const Inmap = {
    };
    const heatoverlay={};
    const boundoverlay={};
    return {
      clsName: "populationAnalysis",
      inmap: function(){
        return Inmap;
      },
      Heatoverlay:function(){
        return heatoverlay;
      },
      Boundoverlay:function(){
        return boundoverlay;
      },
      title: "人口通勤分析",
      navList: [
        {
          name: "工作人口的居住地",
          value: 0
        },
        {
          name: "居住人口的工作地",
          value: 1
        }
      ],
      currentNav: 0,
      seletList: [],
      liveData: [],
      workData: [],
      currentStreetIndex:0,
    };
  },
  mixins: [clsMixin],
  components: {
    HeaderBar,
    SubNav,
    Select
  },
  computed: {
    ...mapState({
      init: state => state.commuting.init,
      streetFencing: state => state.cityInfo.streetFencing,
      dateTime:state => state.cityInfo.dateTime,
      countyCode: state => state.cityInfo.countyCode,
      countyName: state => state.cityInfo.countyName,
      streetCode: state => state.cityInfo.streetCode,
      streetName: state => state.cityInfo.streetName,
      cityCode:state => state.cityInfo.cityCode,
    }),
    ...mapGetters(["getStreetCenter"])
  },
  watch:{
   currentStreetIndex:function(){

   },
   streetName:function(){
     //将对应的街道平移到视野中心
     this.moveCenter(this.streetName);
   }
  },
  mounted() {
    //生成select数据
    const streetFencing = merge({}, this.getStreetCenter);
    const streetList = streetFencing.features;
    this.seletList = streetFencing.features;
    //初始化设置countyName
    if (this.countyName) {
      //从有围栏的页面进入
      const streetOfcountyList = streetList.find(item => {
        return item.properties.district === this.countyName;
      });
      const currentStreet = streetOfcountyList.properties;
      this.setStreet({
        countyCode: this.countyCode,
        countyName: this.countyName,
        streetCode: currentStreet.code_street,
        streetName: currentStreet.street
      });
    } else {
      const currentStreet = streetList[0].properties;
      this.setStreet({
        countyCode: currentStreet.code_district,
        countyName: currentStreet.district,
        streetCode: currentStreet.code_street,
        streetName: currentStreet.street
      });
    }

    this.requestLiveHeatData();
    this.requesWorkHeatData();
    this.initMap();
    this.changeNav(this.navList[0]);
    this.moveCenter(this.streetName);
  },
  methods: {
    ...mapMutations(["setStreet", "setCounty"]),
    requestLiveHeatData() {
      const that = this;
      axios.post('/live_street_heating', {
        code: that.streetCode,
        date: this.dateTime,
      }).then((data)=>{
        if(data.code === 200){
         that.liveData = that.formateHeatData(data.data);
         if(that.Heatoverlay && that.currentNav===0){
           this.Heatoverlay.setData(that.liveData)
         }
        }
      })
    },
    requesWorkHeatData() {
      const that = this;
      axios.post('/work_street_heating', {
        code: that.streetCode,
        date: this.dateTime,
      }).then((data)=>{
        if(data.code === 200){
         that.workData = that.formateHeatData(data.data);
          if(that.Heatoverlay && that.currentNav===1){
           this.Heatoverlay.setData(that.workData)
         }
        }
      })
      
    },
    formateHeatData(data){
      const heatDate = [];
      data.map(item => {
        heatDate.push({
          count: item.count,
          geometry: {
            type: "Point",
            coordinates: [
              item.lng,
              item.lat
            ]
          }
        });
      });
      return heatDate;
    },
    initMap(){
      const allmap = this.$refs.allmap;
      let inmap = new inMap.Map({
        id: allmap,
        skin: "Blueness",
        // center: [],
        zoom: {
          value: 11,
          show: true,
          max: 18,
          min: 5
        }
      });
      //map定义皮肤
      const bmap = inmap.getMap();
      bmap.setMapStyle({
        styleJson: darkSkin
      });
      this.inmap = inmap;
      this.setBoundoverlay();
      this.setHeatOverlay();
    },
    findBoundIndex(streetName){
      let currentStreetIndex = 0
      const data = (merge({}, this.getStreetCenter)).features;
      const list = data.map((item, index) => {
        if (item.properties.street == streetName) {
          currentStreetIndex = index;
        }
      });
      return currentStreetIndex;
    },
    setBoundoverlay() {
      //格式化围栏数据
      const that = this;
      this.currentStreetIndex=this.findBoundIndex(this.streetName)
      const data = (merge({}, this.getStreetCenter)).features;
      const list = data.map((item, index) => {
        item.name = item.properties.street;
        item.count = 1;
      });
      
      let boundoverlay = new inMap.PolygonOverlay({
        zIndex: 2,
        tooltip: {
          show: true,
          formatter: (par)=>{
            return `${par.properties.district}-${par.properties.street}`;
          }
        },
        legend: {
          show: false
        },
        style: {
          normal: {
            borderWidth: 2,
            borderColor: "rgba(0,0,0,0)",
            label: {
              show: false // 是否显示
            }
          },
          selected: {
            backgroundColor: "rgba(34,169,242,0.3)",
            borderWidth: 3,
            label: {
              color: "rgba(255,255,255,1)"
            }
          },
          colors: ["rgba(34,169,242,0.05)"]
        },
        event: {
          onMouseClick(item, event) {
            that.changeStreet(item);
          }
        },
        data: data,
        selected: [data[that.currentStreetIndex]]
      });
      this.inmap.add(boundoverlay);
      this.Boundoverlay = boundoverlay;
    },
    changeStreet(item) {
      const _item = item[0];
      if (_item.name !== this.streetName) {
        const current = _item.properties;
        this.setStreet({
          countyCode: current.code_district,
          countyName: current.district,
          streetCode: current.code_street,
          streetName: current.street
        });
        if (this.currentNav === 0) { //居住
          this.requestLiveHeatData();
        } else {//工作
           this.requesWorkHeatData();
        }
      }
    },
    changeCounty(item){
     if (item.countyName !== this.countyName) {
        this.setCounty(item);
      }
    },
    changeCurrentStreet(item) {
      if (item.streetName !== this.streetName) {
        this.setStreet({
          countyCode: item.countyCode,
          countyName: item.countyName,
          streetCode: item.streetCode,
          streetName: item.streetName
        });
        const data = (merge({}, this.getStreetCenter)).features;
        this.currentStreetIndex=this.findBoundIndex(item.streetName);
        const current = data[this.currentStreetIndex];
              current.name = data[this.currentStreetIndex].properties.street;
              current.count =1;
        this.Boundoverlay.setOptionStyle({
          selected:[current]
        });
        if (this.currentNav === 0) { //居住
          this.requestLiveHeatData();
        } else {//工作
           this.requesWorkHeatData();
        }

      }
    },
    setHeatOverlay(data){
      const cityCode = this.cityCode;
      const maxValue = cityCode === '450500' ? 8 : 2;
      var heatoverlay = new inMap.HeatOverlay({
        zIndex: 1,
        style: {
          radius: 20, // 半径
          maxValue:maxValue
        },
      });
      this.inmap.add(heatoverlay);
      this.Heatoverlay = heatoverlay;
    },
    changeNav(item) {
      if (this.currentNav !== item.value) {
        this.currentNav = item.value;
      }
      let data = [];
      if (item.value === 0) { //居住
         this.requestLiveHeatData();
         data = this.liveData;
      } else {//工作
         this.requesWorkHeatData();
         data = this.workData;
      }
      this.Heatoverlay.setData(data)
    },
    moveCenter(streetName){
      const data=this.seletList.find((item)=>{
        return item.properties.street===streetName;
      });
      if(data){
        const coordinates=data.geometry.coordinates[0][0];
        const center=new BMap.Point(coordinates[0],coordinates[1]);
        this.inmap.getMap().setCenter(center);
      }
    }
  },
  beforeDestroy() {}
};
</script>

<style module lang="less">
@import "./populationAnalysis.less";
</style>
