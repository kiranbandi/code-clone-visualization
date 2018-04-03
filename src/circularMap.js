import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor } from './colors';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData,
        { clientWidth } = document.body,
        squareRange = clientWidth < window.innerHeight ? clientWidth : window.innerHeight,
        width = 0.75 * squareRange,
        radius = width / 2;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('mainContainer').remove()
    let circularMainContainer = d3.select('#root').append('div');
    circularMainContainer.attr('class', 'circularMainContainer')
        .style("width", width + 'px');

    // 
    let circularRootSVG = circularMainContainer.append('svg')
        .attr('class', 'circularRootSVG')
        .attr('height', width)
        .attr('width', width)

    // set constants
    let PI = Math.PI,
        arcMin = (radius / versionCount) * 0.5,
        arcPadding = (radius / versionCount) * 0.25,
        arcAnglePadding = 0.05 * (360 / genealogyList.length);

    circularRootSVG.append('g')
        .attr('class', 'centeredGraphic')
        .attr('transform', 'translate(' + radius + "," + radius + ')')
        .selectAll('.arcContainer')
        .data(genealogyList)
        .enter()
        .append('g')
        .attr('class', 'arcContainer')
        .each(function (data, index) {
            d3.select(this).selectAll('.changeArc-' + index)
                .data(data.set)
                .enter()
                .append('path')
                .attr('class', '.changeArc-' + index)
                .attr("d", d3.arc()
                    .innerRadius(function (d, i) {
                        return arcMin + (((radius / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCount * 2)));
                    })
                    .outerRadius(function (d, i) {
                        return arcMin + (((radius / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCount * 2))) + (radius / versionCount) - arcPadding;
                    })
                    .startAngle(index * (360 / genealogyList.length) * (PI / 180))
                    .endAngle(function (d, i) {
                        return (((index + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180));
                    }))
                .attr('fill', (d, i) => {
                    return d.changeType.indexOf('no_change') > -1 ? greenColor : d.changeType.indexOf('inconsistent_change') > -1 ? redColor : blueColor;
                })
        })


}






