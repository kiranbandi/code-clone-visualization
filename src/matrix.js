import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor, grayColor } from './colors';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData,
        squareRange = document.body.clientWidth;

    let width = squareRange - (squareRange / 10),
        height = width / 5;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('matrixMainContainer').remove()

    let matrixMainContainer = d3.select('#root').append('div')

    matrixMainContainer.attr('class', 'matrixMainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    let contentContainer = matrixMainContainer.append('svg')
        .attr('class', 'contentContainer')
        .attr('height', height)
        .attr('width', width)

    let response = new Array(genealogyList.length);

    for (let i = 0; i < genealogyList.length; i++) {
        for (let j = 0; j < versionCount; j++) {
            response[i] = new Array(j).fill(0);
        }
    }

    let newVersionList = uniqueVersionList.slice(1, uniqueVersionList.length);

    genealogyList.forEach(function (item, index) {
        item.set.forEach(function (e, i) {
            if (i < versionCount) {
                let y = newVersionList.indexOf(e.target.version);
                response[index][y] = {
                    nodeType: "target",
                    classId: e.target.classId,
                    cloneType: e.target.cloneType,
                    changeType: e.changeType
                };
            }
        });
    });

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("");

    let x = d3.scaleBand()
        .domain(d3.range(versionCount))
        .rangeRound([0, height]);

    let y = d3.scaleBand()
        .domain(d3.range(genealogyList.length))
        .range([0, width]);

    let row = contentContainer.selectAll(".row")
        .data(response)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) {
            return "translate(" + y(i) + ",10)";
        });

    let cell = row.selectAll(".cell")
        .data(function (d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; });

    cell.append('rect')
        .attr("width", y.bandwidth())
        .attr("height", x.bandwidth())
        .style("stroke", grayColor)
        .style("stroke-width", "0.5px")
        .style("fill", function (d, i) {
            if (i && d) {
                if (d.nodeType === "source") {
                    if (d.classId === undefined) {
                        return "white";
                    } else {
                        return "#eee";
                    }
                }
                if (d.nodeType === "target") {
                    if (d.changeType === undefined) {
                        return "white";
                    } else if (d.changeType.indexOf("no_change") > -1) {
                        return greenColor;
                    } else if (d.changeType.indexOf("inconsistent_change") > -1) {
                        return redColor;
                    } else if (d.changeType.indexOf("consistent_change") > -1) {
                        return blueColor;
                    }
                }
            } else {
                if (d.changeType === undefined) {
                    return "white";
                } else if (d.changeType.indexOf("no_change") > -1) {
                    return greenColor;
                } else if (d.changeType.indexOf("inconsistent_change") > -1) {
                    return redColor;
                } else if (d.changeType.indexOf("consistent_change") > -1) {
                    return blueColor;
                } else {
                    return "white";
                }
            }
        })
        .on("mouseover", function (d) {
            if (d.classId && d.changeType && d.cloneType) {
                let msg = "<b>ClassId: </b>" + d.classId + "<br>";
                msg += "<b>ChangeType: </b>" + d.changeType + "<br>";
                msg += "<b>CloneType: </b>" + d.cloneType;
                tooltip.html(msg);
                return tooltip.style("visibility", "visible");
            }
        })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })

}

