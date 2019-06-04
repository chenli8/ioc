import { FONTCOLOR } from './color';
export const grid = {
    show: false
}
export const legend = {
    itemHeight: 10,
    itemWidth: 10,
    orient: 'horizontal',
    padding :[10,5],
    textStyle: {
        padding: [0, 0, 3, 3],
        color: FONTCOLOR
    },
    data: []
}
export const tooltip = {
    show: false,
    trigger: 'axis'
}
export const radarBase = {
    radius : '60%'
}
export const series = {
    type: 'radar',
    data: []
}