import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';

let blueColor = 'rgb(107, 174, 214)',
    redColor = 'rgb(173, 73, 74)',
    greenColor = 'rgb(116, 196, 118)',
    purpleColor = 'rgb(158, 154, 200)',
    grayColor = 'rgb(99, 99, 99)';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData;

    let paddingHeightPerGroup = 40;
    let marginPadding = 80;
    let height = (genealogyList.length * paddingHeightPerGroup) + 100;
    let width = document.body.clientWidth - marginPadding;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('mainContainer').remove()

    let mainContainer = d3.select('#root').append('div')
    mainContainer.attr('class', 'mainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    let versionNameContainer = mainContainer.append('div')
        .attr('class', 'versionNameContainer')
        .selectAll('h2')
        .data(uniqueVersionList)
        .enter()
        .append('h2')
        .style("width", width / versionCount + 'px')
        .text((d) => d)

    let contentContainer = mainContainer.append('svg')
        .attr('class', 'contentContainer')
        .attr('height', height)
        .attr('width', width)

    let genealogySetGroup = contentContainer.selectAll('g')
        .data(genealogyList)
        .enter()
        .append('g')
        .attr('transform', (d, i) => "translate(0," + paddingHeightPerGroup * i + ")")
        .on('mouseover',function(){
                debugger;
        })

    genealogySetGroup.selectAll('.changeLine').data((d) => d.set)
        .enter()
        .append('line')
        .style('stroke', (d, i) => {
            return d.changeType.indexOf('no_change') > -1 ?
                greenColor : d.changeType.indexOf('inconsistent_change') > -1 ? redColor : blueColor;
        })
        .style('stroke-dasharray', (d, i) => d.changeType.indexOf('deleted') > -1 ? '10' : '0')
        .attr("class", 'changeLine')
        .attr('x1', 0)
        .attr('y1', (d) => d.changeType.indexOf('added') > -1 ? '-4' : '0')
        .attr('x1', width / versionCount)
        .attr('y2', (d) => d.changeType.indexOf('added') > -1 ? '-4' : '0')
        .attr("transform", function (d, i) {
            return "translate(" + (((width / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (width / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })

    // To Get the second line we simply redo the same line code except the stroke dash is offset to be invisible and the y cordinates are shifted
    // This is a Temporary Workaround 
    genealogySetGroup.selectAll('.changeLineDouble').data((d) => d.set)
        .enter()
        .append('line')
        .style('stroke', (d, i) => {
            return d.changeType.indexOf('no_change') > -1 ?
                greenColor : d.changeType.indexOf('inconsistent_change') > -1 ? redColor : blueColor;
        }).attr("class", 'changeLineDouble')
        .attr('x1', 0)
        .attr('y1', 4)
        .attr('x1', width / versionCount)
        .attr('y2', 4)
        .attr("transform", function (d, i) {
            return "translate(" + (((width / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (width / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })
        .style('stroke-dasharray', (d, i) => d.changeType.indexOf('added') > -1 ? '0' : ('0' + "," + width / versionCount))


    genealogySetGroup.selectAll('.cloneMarker').data((d) => d.serialList)
        .enter()
        .append('path')
        .attr("class", 'cloneMarker ')
        .attr("d", symbol().size(375).type((d, i) => symbolCircle))
        .style("fill", (d, i) => { return d.cloneType.length > 1 ? grayColor : 'white' })
        .attr("transform", function (d, i) {
            return "translate(" + (((width / versionCount) * i) + (width / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })

    genealogySetGroup.selectAll('.cloneMarkerText').data((d) => d.serialList)
        .enter()
        .append('text')
        .attr("class", 'cloneMarkerText ')
        .text((d) => {
            return d.cloneType.length > 1 ? d.cloneType.split("-")[1] : ''
        })
        .attr("transform", function (d, i) {
            return "translate(" + (((width / versionCount) * i) + (width / (versionCount * 2)) - 4) + "," + (paddingHeightPerGroup + 5) + ")";
        });

}

