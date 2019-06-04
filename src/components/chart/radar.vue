<template>
    <div class="ui-radar-container"  ref="charts"></div>
</template>
<script>
import echarts from 'echarts';
import mixins from './mixins/radarMixins';
import '@/style/lineBar.css';
export default {
    name : "Radar",
    data(){
        const gloalChart = {
            config : {},
            echartObj : null
        }
        return {
            getChart(){
                return gloalChart
            }
        }
    },
    props : {
        series : {
            type : Array,
            default : ()=>{
                return []
            }
        },
        showValue : {
            type : Boolean,
            default : true
        }
    },
    watch : {
        series : {
            handler(){
                this.initChart();
            },
            deep : true
        }
    },
    mixins : [mixins],
    methods : {
        initConfig(){
            this.updategrid();
            this.updateToolTip();
            this.updateLengend();
            this.updateRadar();
            this.initSeries();
        },
        initChart(){
            this.initConfig();
            let { config, echartObj } = this.getChart();
            if( !echartObj ){
                echartObj = echarts.init( this.$refs.charts );
                window.addEventListener('resize',echartObj.resize);
            }
            echartObj.setOption( config,true );
        },
        destoryChart(){
            const chart = this.getChart();
            if( chart.echartObj ){
                window.removeEventListener('resize',chart.echartObj.resize);
                chart.echartObj.dispose();
                chart.echartObj = null;   
            }
        }
    },
    beforeDestroy() {
        this.destoryChart();   
    }
}
</script>