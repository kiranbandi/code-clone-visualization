import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor, grayColor } from './colors';


export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList, classIds } = cloneData;

    let paddingHeightPerGroup = 60;
    let marginPadding = 80;
    let width = document.body.clientWidth - marginPadding;
    let height = (genealogyList.length * paddingHeightPerGroup) + 100;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('matrixMainContainer').remove()

    let matrixMainContainer = d3.select('#root').append('div')
    matrixMainContainer.attr('class', 'matrixMainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    let contentContainer = matrixMainContainer.append('svg')
        .attr('class', 'contentContainer')
        .attr('height', height)
        .attr('width', width + 20)

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
        .rangeRound([0, width / 4]);

    let y = d3.scaleBand()
        .domain(d3.range(classIds.length))
        .rangeRound([0, height]);

    let row = contentContainer.selectAll(".row")
        .data(response)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) {
            if (y(i) == undefined) {
                this.remove();
            }
            else {
                return "translate(20," + y(i) + ")";
            }
        });

    let cell = row.selectAll(".cell")
        .data(function (d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d, i) { return "translate(" + x(i) + ", 0)"; });

    cell.append('rect')
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("fill", function (d, i) {
            // console.log(d, i);
            // console.log(d.changeType === "inconsistent_change added");
            if (i && d) {
                // console.log(d,i,"yo");
                if (d.nodeType === "source") {
                    // console.log(d.classId,d.changeType, "source");
                    if (d.classId === undefined) {
                        return "white";
                    } else {
                        return "#eee";
                    }
                }
                if (d.nodeType === "target") {
                    // console.log(d.classId, d.changeType, "target");
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

    contentContainer
        .attr("transform-origin", "top left")
        .attr("transform", "rotate(-90) translate(-" + width / 4 + ",0) scale(1," + ((contentContainer._parents[0].clientWidth - marginPadding) / height) + ")")

    matrixMainContainer
        .attr("height", "" + contentContainer._parents[0].clientHeight)


}

