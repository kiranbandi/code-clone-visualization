import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor } from './colors';
import cloneMap from './cloneMap';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData,
        { clientWidth } = document.body,
        squareRange = clientWidth < window.innerHeight ? clientWidth : window.innerHeight,
        width = 0.75 * squareRange,
        radius = width / 2;

    let circularMainContainer = d3.select('#root').append('div');
    circularMainContainer.attr('class', 'circularMainContainer')
        .style("width", width + 'px').selectAll("*").remove();


    let circularRootSVG = circularMainContainer.append('svg')
        .attr('class', 'circularRootSVG')
        .attr('height', width)
        .attr('width', width)

    // set constants
    let PI = Math.PI,
        arcMin = (radius / versionCount) * 0.5,
        arcPadding = (radius / versionCount) * 0.25,
        arcAnglePadding = 0.05 * (360 / genealogyList.length);

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip-circularMap")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("");

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
        .on("mouseover", function (d) {
            tooltip.html(d.info.replace(/\n/g, '<br />'));
            return tooltip.style("visibility", "visible");
        })
        .on("click", function (d) {
            d3.select('.historyTitle').remove();
            d3.select('#root').append('h3').attr('class', 'SubHeadingTitle plotTitle historyTitle').text('Clone Change History');
            cloneMap({ 'genealogyList': [d], versionCount, uniqueVersionList });
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })


}






