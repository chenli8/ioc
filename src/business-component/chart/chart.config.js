import hexToRgba from '@/lib/hexToRgba.js';
/**
 * chart图系统默认的配置项(基于业务)
 */
//蓝绿红黄
export const COLORS = ['#48CEE8', '#45E794', '#FD5F83', '#FCD164'];
//蓝色渐变
// export const BLUECOLORS = ['#1671A8', '#48CEE8'];
export const BLUECOLORS = [ '#137AEF ','#63BAFE'];
//绿色渐变
export const GREENCOLORS = ['#24BDBA', '#45E794'];
//红色渐变
export const REDCOLORS = [ '#F28B6E','#FD5F83'];
//黄色渐变
export const YELLOWCOLORS = ['#FCD164', '#F59D6C'];
//颜色渐变组 蓝绿橙红
export const GRADIENTCOLORS = BLUECOLORS.concat(GREENCOLORS)
  .concat(REDCOLORS)
  .concat(YELLOWCOLORS);
//颜色渐变组 蓝深橙红
export const MixCOLORS = BLUECOLORS.concat(REDCOLORS)

//蓝深蓝绿深绿橙色 现用于部分饼图
// export const COLORS2 = ['#40C1E1', '#76DCF6', '#2BC6B3', '#37D5A5', '#F08B75'];
export const COLORS2 = [ '#2085F2','#76DCF6' ,'#25BEB9','#44E694','#CC3A0D'];
//字体颜色
export const FONTCOLOR = '#A5DCFF';
//目前飞线图geo label使用
export const FONTCOLOR2 = '#37abd2';
export const BORDERCOLOR = '#1b70a3';
export const SHADOWCOLOR = '#2185F0';
//白色
export const WHILE = '#FFFFFF';
//红色(目前飞线图在用)
export const RED = '#FC6481';

//地图色系 深蓝、浅蓝、绿色、橙色、红色
export const MAPCOLORS = [
  '#0060C7',
  '#1494F0',
  '#25FF8F',
  '#FF6C36',
  '#FF3E63'
];
export const MAPCOLORSOPACITY = [0.75, 0.75, 0.5, 0.75, 0.75];
//地图边线
export const MAPBORDERCOLORS = [
  '#1F84F1',
  '#139CF7',
  '#25FF8F',
  '#FF6C36',
  '#FF3E63'
];
export const MAPCOLORSBORDEROPACITY = [1, 1, 1, 1, 1];

//   /**
//    * 获取雷达图基本配置
//    */
//   getRadarBaseConfig: () => {
//     return {
//       grid: {
//         top: '50px',
//         left: '5%',
//         right: '5%',
//         bottom: '0px',
//         containLabel: true
//       },
//       tooltip: {
//         show: true,
//         trigger: 'item'
//       },
//       legend: {
//         type: 'scroll',
//         textStyle: {
//           padding: [0, 0, 3, 8],
//           color: FONTCOLOR
//         },
//         data: []
//       },
//       radar: [
//         {
//           center: ['50%', '50%'],
//           radius: 67,
//           indicator: []
//         }
//       ],
//       series: [
//         {
//           type: 'radar',
//           itemStyle: {
//             normal: {
//               areaStyle: {
//                 type: 'default'
//               }
//             }
//           },
//           data: []
//         }
//       ]
//     };
//   }

export const getIcon = color => {
  return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
};
/**
 * 获取横向柱状图基本配置
 */
export const getHorizontalBarConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      textStyle: {
        padding: [0, 0, 3, 8],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, '42%'],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          color: FONTCOLOR
        }
      }
    ],
    series: []
  };
};
/**
 * 获取横向柱状图Series基本配置
 */
export const getHorizontalBarSeriesConfig = () => {
  return {
    type: 'bar',
    label: {
      show: true,
      position: 'right',
      color: FONTCOLOR
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: BLUECOLORS[0]
          },
          {
            offset: 1,
            color: BLUECOLORS[1]
          }
        ],
        global: false
      }
    },
    barWidth: '30%',
    data: []
  };
};
/**
 * 柱状图阴影
 * @param {String} orient vertical|horizontal
 * @return Object
 */
export const getBarShadowConfig = (orient = 'horizontal') => {
  return {
    type: 'bar',
    label: {
      show: true,
      position: 'right',
      distance: 8,
      color: FONTCOLOR
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: orient === 'horizontal' ? 1 : 0,
        y2: orient === 'vertical' ? 1 : 0,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(BLUECOLORS[0], 0.3)
          },
          {
            offset: 1,
            color: hexToRgba(BLUECOLORS[1], 0.3)
          }
        ],
        global: false
      }
    },
    barGap: '-100%',
    barWidth: '30%',
    data: [],
    animation: false
  };
};
/**
 * 获取横向柱状堆积图基本配置
 */
export const getHorizontalStackBarConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 24,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      left: 0,
      top: -5, //在echart容器内-5正好处在左上角,0则距离top有一些间距
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, 0],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 0,
          margin: 18,
          color: FONTCOLOR,
          fontSize: 14
        }
      }
    ],
    series: []
  };
};
/**
 * 获取横向柱状堆积图Series基本配置
 */
export const getHorizontalStackBarSeriesConfig = () => {
  return {
    type: 'bar',
    label: {
      show: true,
      position: 'inside',
      color: WHILE,
      fontSize: 14
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    barWidth: '45%',
    data: []
  };
};
/**
 * 获取柱状图基本配置
 */
export const getBarConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 30, //距离图例的高度
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      left: 8,
      top: -5,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: 10,
          color: FONTCOLOR
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: FONTCOLOR
        },
        nameGap: 8,
        boundaryGap: [0, 0],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba(FONTCOLOR, 0.15)
          }
        },
        axisLabel: {
          show: true,
          color: FONTCOLOR
        }
      }
    ],
    series: []
  };
};
/**
 * 获取柱状图Series基本配置
 */
export const getBarSeriesConfig = () => {
  return {
    type: 'bar',
    label: {
      show: true,
      position: 'outside',
      color: FONTCOLOR
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    barWidth: '30%',
    barGap: '20%',
    data: []
  };
};
/**
 * 获取纵向折线柱状混合图基本配置
 */
export const getLineBarConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 30, //距离图例的高度
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      left: 8,
      top: -5,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: FONTCOLOR
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: FONTCOLOR
        },
        nameGap: 8,
        boundaryGap: [0, 0],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba(FONTCOLOR, 0.15)
          }
        },
        axisLabel: {
          show: true,
          color: FONTCOLOR
        }
      },
      {
        type: 'value',
        boundaryGap: [0, 0],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          color: FONTCOLOR
        }
      }
    ],
    series: []
  };
};
/**
 * 获取纵向折线柱状混合图Series基本配置
 */
export const getLineBarSeriesConfig = () => {
  return {
    type: 'bar',
    label: {
      show: false,
      position: 'inside',
      color: WHILE
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    lineStyle: {
      width: 1
    },
    barWidth: '30%',
    barGap: '20%',
    data: []
  };
};
/**
 * 获取纵向折线图基本配置
 */
export const getLineConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 30, //距离图例的高度
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      top: -5,
      left: 0,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: FONTCOLOR
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: FONTCOLOR
        },
        boundaryGap: [0, 0],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba(FONTCOLOR, 0.15)
          }
        },
        axisLabel: {
          show: true,
          interval: 0,
          color: FONTCOLOR
        }
      }
    ],
    series: []
  };
};
/**
 * 获取纵向折线图Series基本配置
 */
export const getLineSeriesConfig = () => {
  return {
    type: 'line',
    symbol: 'circle',
    label: {
      show: false,
      position: 'inside',
      color: WHILE
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    lineStyle: {
      width: 1
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    data: []
  };
};
/**
 * 获取地图基本配置
 */
export const getMapConfig = () => {
  return {
    color: [].concat(MAPCOLORS),
    borderColor: [].concat(MAPBORDERCOLORS), //自定义属性
    legend: {
      show: true
    },
    tooltip: {
      show: true
    },
    series: []
  };
};
/**
 * 获取地图Series基本配置
 */
export const getMapSeriesConfig = () => {
  return {
    type: 'map',
    roam: false,
    aspectScale: 1,
    top: 0,
    bottom: 0,
    label: {
      show: true,
      color: hexToRgba(WHILE, 0.55),
      fontSize: 16
    },
    itemStyle: {
      areaColor: hexToRgba(MAPCOLORS[0], 0.5),
      borderWidth: 1,
      borderColor: MAPBORDERCOLORS[0],
      shadowColor: hexToRgba(SHADOWCOLOR, 0.5),
      shadowOffsetX: -12,
      shadowOffsetY: 4
    },
    showLegendSymbol: false,
    data: []
  };
};
/**
 * 获取饼图基本配置
 */
export const getPieConfig = () => {
  return {
    color: [].concat(MixCOLORS),
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      top: -5,
      left: 0,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    series: []
  };
};
/**
 * 获取饼图Series基本配置
 */
export const getPieSeriesConfig = () => {
  return {
    type: 'pie',
    radius: ['50%', '80%'] /*内半径、外半径 */,
    hoverAnimation: false,
    label: {
      show: false,
      position: 'outside'
    },
    itemStyle: {
      borderColor: 'rgb(0, 23, 53,0.5)',
      borderWidth: 1.5,
      color: {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    //是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。如果不需要开启该策略，例如圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false
    avoidLabelOverlap: false,
    data: []
  };
};
/**
 * 获取geo基本配置
 */
export const LIGHTPINKCOLOR = '#F8877A'; //浅粉色
export const LIGHTGREENCOLOR = '#47D6D0'; //浅绿
export const GEOCOLORS = '#002864'; //#002864=深蓝地图area
export const GEOCOLORS2 = '#003692'; //#003692=深蓝地图area
export const GEOBORDERCOLORS = '#1F84F1'; //#30A1CB=蓝色地图 border
export const GEOSCATTERCOLOR = '#F2C36E'; //#F2C36E=黄色 地图.散点、飞行的线、散点文字
export const getGeoConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    tooltip: {
      show: true,
      trigger: 'item'
    },
    legend: {
      show: true,
      type: 'scroll',
      top: -5,
      left: 0,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    geo: {
      map: 'china',
      selectedMode:'single',
      label: {
        emphasis: {
          show: false
        }
      },
      roam: false,
      zoom: 1,
      itemStyle: {
        borderWidth: 1.4,
        areaColor: GEOCOLORS,
        borderColor: GEOBORDERCOLORS
      },
      emphasis: {
        label: {
          show: false
        },
        itemStyle: {
          areaColor: GEOCOLORS
        }
      },
      regions: []
    },
    series: []
  };
};
/**
 * 获取GeoSeries基本配置
 */

export const getGeoSeriesConfig = () => {
  return [
    {
      type: 'lines',
      zlevel: 1,
      effect: {
        show: true,
        period: 6 /*特效动画的时间 */,
        trailLength: 0.7 /* 拖尾长度 0-1 */,
        color: hexToRgba(GEOSCATTERCOLOR, 0.5),
        symbolSize: [1, 10]
      },
      lineStyle: {
        color: hexToRgba(REDCOLORS[1], 0.75),
        width: 0.2,
        curveness: 0.1 /*边的曲度，支持从 0 到 1 的值，值越大曲度越大*/
      },
      tooltip: {
        show: false
      },
      data: []
    },
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 2,
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}'
      },
      symbolSize: function(val) {
        return val[2] === 99999 ? 8 : 5;
      },
      itemStyle: {
        color: GEOSCATTERCOLOR
      },
      data: []
    }
  ];
};
/**
 * 获取散点图基本配置
 */
export const getScatterConfig = () => {
  return {
    color: [].concat(GRADIENTCOLORS),
    grid: {
      top: 30, //距离图例的高度
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      type: 'scroll',
      left: 8,
      top: -5,
      itemGap: 24,
      itemHeight: 8,
      textStyle: {
        padding: [0, 0, 0, 0],
        color: FONTCOLOR
      },
      data: []
    },
    xAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: FONTCOLOR
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: 10,
          color: FONTCOLOR
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: FONTCOLOR
        },
        nameGap: 8,
        boundaryGap: [0, 0],
        axisLine: {
          show: true,
          lineStyle: {
            color: hexToRgba(FONTCOLOR, 0.15)
          }
        },
        axisTick: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba(FONTCOLOR, 0.15)
          }
        },
        axisLabel: {
          show: true,
          color: FONTCOLOR
        }
      }
    ],
    series: []
  };
};
/**
 * 获取散点图Series基本配置
 */
export const getScatterSeriesConfig = () => {
  return {
    type: 'scatter',
    label: {
      show: true,
      position: 'right',
      color: FONTCOLOR
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [
          {
            offset: 0,
            color: hexToRgba(GRADIENTCOLORS[0], 1)
          },
          {
            offset: 1,
            color: hexToRgba(GRADIENTCOLORS[1], 1)
          }
        ],
        global: false
      }
    },
    symbol: 'circle',
    symbolSize: 16,
    data: []
  };
};
// map地图色系 
//深色色系 DarkSkin
export const darkSkin=[
  {
            "featureType": "background",
            "elementType": "all",
            "stylers": {
                      "color": "#011a73ff"
            }
  },
  {
            "featureType": "all",
            "elementType": "all",
            "stylers": {
                      "color": "#081953ff"
            }
  },
  {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#51a2ebff"
            }
  },
  {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": {
                      "visibility": "off"
            }
  },
  {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                      "visibility": "on"
            }
  },
  {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": {
                      "color": "#18213f"
            }
  },
  {
            "featureType": "boundary",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#839dd3"
            }
  },
  {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": {
                      "color": "#2f437fff"
            }
  },
  {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#839dd3"
            }
  },
  {
            "featureType": "boundary",
            "elementType": "geometry.fill",
            "stylers": {
                      "color": "#6287d5"
            }
  },
  {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#9cbcffff"
            }
  },
  {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#b0c9ffff"
            }
  },
  {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#8eaef1ff"
            }
  },
  {
            "featureType": "subway",
            "elementType": "geometry.fill",
            "stylers": {
                      "color": "#426cc5ff",
                      "weight": "0.5"
            }
  },
  {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                      "color": "#1f418aff"
            }
  },
  {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                      "color": "#193f8eff"
            }
  },
  {
            "featureType": "subway",
            "elementType": "labels.icon",
            "stylers": {
                      "visibility": "off"
            }
  },
  {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#567ed3ff"
            }
  },
  {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                      "color": "#92b5ffff"
            }
  },
  {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                      "visibility": "off"
            }
  }
]