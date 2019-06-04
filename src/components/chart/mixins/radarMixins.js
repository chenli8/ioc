import {
    grid,
    tooltip,
    legend,
    series,
    radarBase
} from '../config/radarConfig';
import { COLORS } from '../config/color';
import {copy, merge } from '../libs/util.js';
export default {
    props : {
        grid : {
            type : Object,
            default : ()=>{
                return {}
            }
        },
        tooltip : {
            type : Object,
            default :()=>{
                return {}
            }
        },
        legend : {
            type : Object,
            default : ()=>{
                return {}
            }
        },
        radar : {
            type : Object,
            default : ()=>{
                return {};
            }
        }
    },
    methods: {
        updategrid(){
            const { config }  = this.getChart();
            const _grid = copy( grid );
            if( Array.isArray( this.grid ) ){
                config.grid = [];
                this.grid.forEach((item)=>{
                    config.grid.push(
                        merge(_grid,item )
                    )
                })
            }else{
                config.grid = merge( _grid,this.grid || {} )
            }
        },
        updateRadar(){
            const { config }  = this.getChart();
            const _radarBase = copy( radarBase );
            config.radar = merge(_radarBase,this.radar);
        },
        updateToolTip(){
            const { config }  = this.getChart();
            config.tooltip = copy( tooltip );
            config.tooltip = merge( config.tooltip,this.tooltip );
        },
        initSeries(){
            let { config }  = this.getChart();
            config.series = config.series || [];
            let legendSet = false;
            //设置legenddata
            if( config.legend && Array.isArray( config.legend.data ) && config.legend.data.length === 0 ){
                legendSet = true;
                config.legend = config.legend || {};
                config.legend.data = config.legend.data || [];
            }
            const _series = copy( series );
            this.series.forEach((it)=>{
                let _it = merge(_series, it );
                _it.type = 'radar';
                config.series.push( _it );
                if( legendSet && it.data ){
                    it.data.forEach((item)=>{
                        config.legend.data.push(item.name)
                    })
                }
            })
        },
        updateLengend(){
            const { config }  = this.getChart();
            config.legend = copy( legend );
            config.legend = merge( config.legend,this.legend );
            config.color = COLORS.concat([]);
        }
    }
}  