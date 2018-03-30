import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData;

    let paddingHeightPerGroup = 0.25,
        marginRatio = 4,
        width = document.body.clientWidth - (document.body.clientWidth / 4),
        height = width,
        radius = width / 2,
        markerSize = 5000 / genealogyList.length;

    let circularMainContainer = d3.select('#root').append('div');

    circularMainContainer.attr('class', 'circularMainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    let circularRootSVG = circularMainContainer.append('svg')
        .attr('class', 'circularRootSVG')
        .attr('height', height)
        .attr('width', width)

    let genealogySetGroup = circularRootSVG.selectAll('g')
        .data(genealogyList)
        .enter()
        .append('g')
        .attr('transform', (d, i) => "translate(" + radius + "," + height / 2 + ") rotate(" + (360 * i) / genealogyList.length + ")")

    // To Get the second line we simply redo the same line code except the stroke dash is offset to be invisible and the y cordinates are shifted
    // This is a Temporary Workaround 
    genealogySetGroup.selectAll('.changeLineDouble').data((d) => d.set)
        .enter()
        .append('line')
        .style('stroke', (d, i) => {
            return d.changeType.indexOf('no_change') > -1 ?
                'green' : d.changeType.indexOf('inconsistent_change') > -1 ? 'red' : 'blue';
        }).attr("class", 'changeLineDouble')
        .attr('x1', 0)
        .attr('y1', 4)
        .attr('x1', radius / versionCount)
        .attr('y2', 4)
        .attr("transform", function (d, i) {
            return "translate(" + (((radius / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })
        .style('stroke-dasharray', (d, i) => d.changeType.indexOf('added') > -1 ? '0' : ('0' + "," + radius / versionCount))


    genealogySetGroup.selectAll('.changeLine').data((d) => d.set)
        .enter()
        .append('line')
        .style('stroke', (d, i) => {
            return d.changeType.indexOf('no_change') > -1 ?
                'green' : d.changeType.indexOf('inconsistent_change') > -1 ? 'red' : 'blue';
        })
        .style('stroke-dasharray', (d, i) => d.changeType.indexOf('deleted') > -1 ? '10' : '0')
        .attr("class", 'changeLine')
        .attr('x1', 0)
        .attr('y1', (d) => d.changeType.indexOf('added') > -1 ? '-4' : '0')
        .attr('x1', radius / versionCount)
        .attr('y2', (d) => d.changeType.indexOf('added') > -1 ? '-4' : '0')
        .attr("transform", function (d, i) {
            return "translate(" + (((radius / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })

    // Actual clone markers , circular d3 symbols 
    genealogySetGroup.selectAll('.cloneMarker').data((d) => d.serialList)
        .enter()
        .append('path')
        .attr("class", 'cloneMarker ')
        .attr("d", symbol().size(markerSize).type((d, i) => symbolCircle))
        .style("fill", (d, i) => { return d.cloneType.length > 1 ? '#4d4b63' : '#e4cccc' })
        .attr("transform", function (d, i) {
            return "translate(" + (((radius / (versionCount)) * i) + (radius / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })


}






