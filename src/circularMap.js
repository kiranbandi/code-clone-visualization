import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';

// old blue color rgb(107, 174, 214)
let blueColor = 'rgb(49, 152, 214)',
    redColor = 'rgb(167, 54, 56)',
    greenColor = 'rgb(86, 189, 89)',
    purpleColor = 'rgb(158, 154, 200)',
    grayColor = 'rgb(150, 150, 150)';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData,
        { clientWidth } = document.body,
        squareRange = clientWidth < window.innerHeight ? clientWidth : window.innerHeight;


    // genealogyList = genealogyList.slice(0, 100);

    let paddingHeightPerGroup = 0.25,
        marginRatio = 4,
        width = squareRange - (squareRange / 5),
        radius = width / 2,
        markerSize = 5000 / genealogyList.length;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('mainContainer').remove()

    let circularMainContainer = d3.select('#root').append('div');

    circularMainContainer.attr('class', 'circularMainContainer')
        .style("width", width + 'px')
        .style("height", width + 'px');

    let circularRootSVG = circularMainContainer.append('svg')
        .attr('class', 'circularRootSVG')
        .attr('height', width)
        .attr('width', width)
        //so it looks like the first element starts from the top
        .attr('transform', 'rotate(-90)')

    // code for basic g containers
    let genealogySetGroup = circularRootSVG.selectAll('g')
        .data(genealogyList)
        .enter()
        .append('g')
        .attr('transform', (d, i) => "translate(" + radius + "," + width / 2 + ") rotate(" + (360 * i) / genealogyList.length + ")")

    // code for normal line connectors
    genealogySetGroup.selectAll('.changeLine').data((d) => d.set)
        .enter()
        .append('line')
        .style('stroke', (d, i) => {
            return d.changeType.indexOf('no_change') > -1 ?
                greenColor : d.changeType.indexOf('inconsistent_change') > -1 ? redColor : blueColor;
        })
        .attr("class", 'changeLine')
        .attr('x1', 0)
        .attr('y1', '0')
        .attr('x1', radius / versionCount)
        .attr('y2', '0')
        .attr("transform", function (d, i) {
            return "translate(" + (((radius / versionCount) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
        })

    // code for cicles to show levels 
    circularRootSVG.selectAll("circle")
        .data(d3.range(versionCount))
        .enter().append("circle")
        .style("stroke", grayColor)
        .style("stroke-width", '2')
        .style('fill', 'none')
        .attr("r", (d, i) => (((radius / (versionCount)) * i) + (radius / (versionCount * 2))))
        .attr("cx", radius)
        .attr("cy", width / 2);

    // Actual clone markers , circular d3 symbols 
    genealogySetGroup.selectAll('.cloneMarker').data((d) => d.serialList)
        .enter()
        .append('path')
        .attr("class", 'cloneMarker ')
        .attr("d", symbol().size(markerSize).type((d, i) => symbolCircle))
        .style("fill", grayColor)
        .attr("transform", function (d, i) {
            if (d.cloneType.length > 1) {
                return "translate(" + (((radius / (versionCount)) * i) + (radius / (versionCount * 2))) + "," + paddingHeightPerGroup + ")";
            }
            else {
                this.remove();
            }
        })

}






