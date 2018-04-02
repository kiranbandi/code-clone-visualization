import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';

let blueColor = 'rgb(107, 174, 214)',
    redColor = 'rgb(173, 73, 74)',
    greenColor = 'rgb(116, 196, 118)',
    purpleColor = 'rgb(158, 154, 200)',
    grayColor = 'rgb(99, 99, 99)';

export default function (cloneData) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList, classIds } = cloneData;

    let paddingHeightPerGroup = 60;
    let marginPadding = 80;
    let height = (genealogyList.length * paddingHeightPerGroup) + 100;
    let width = document.body.clientWidth - marginPadding;

    // if a map exists remove it , could probably handle this better in a future version 
    d3.selectAll('matrixMainContainer').remove()

    let matrixMainContainer = d3.select('#root').append('div')
    matrixMainContainer.attr('class', 'matrixMainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    let versionNameContainer = matrixMainContainer.append('div')
        .attr('class', 'versionNameContainer')
        .selectAll('h2')
        .data(uniqueVersionList)
        .enter()
        .append('h2')
        .style("width", width / versionCount + 'px')
        .text((d) => d)

    let contentContainer = matrixMainContainer.append('svg')
        .attr('class', 'contentContainer')
        .attr('height', height)
        .attr('width', width + 20)

    let response = new Array(classIds.length);

    for(let i=0; i<classIds.length; i++){
        for(let j=0; j<=versionCount; j++){
            response[i] = new Array(j).fill(0);
            // response[i][j] = 0;
        }

    }

    classIds = classIds.sort(function (a,b) {
        return a.id - b.id;
    });

    genealogyList.forEach(function (item,index) {
        item.set.forEach(function (e) {

            let xS = classIds.map(function(el) {
                return el.id;
            }).indexOf(e.source.classId);

            let xT = classIds.map(function(el) {
                return el.id;
            }).indexOf(e.target.classId);

            let yS = uniqueVersionList.indexOf(e.source.version);

            let yT = uniqueVersionList.indexOf(e.target.version);


            response[xT][yT] = {
                nodeType:"target",
                classId:e.target.classId,
                cloneType:e.target.cloneType,
                changeType:e.changeType
            };

            // response[xS][yS] = {
            //     nodeType:"source",
            //     classId:e.source.classId,
            //     cloneType:e.source.cloneType,
            //     changeType:e.changeType
            // };

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
        .rangeRound([0, width]);

    let y = d3.scaleBand()
        .domain(d3.range(classIds.length))
        .rangeRound([0, height]);

    let row = contentContainer.selectAll(".row")
        .data(response)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(20," + y(i) + ")"; });

    contentContainer.append("defs")
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#010101')
        .attr('stroke-width', 1)
        .attr("opacity",0.5);

    contentContainer.append("defs")
        .append('pattern')
        .attr('id', 'emptyHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M 0,0, L200,200 M200,0 L0,200')
        .attr('stroke', '#010101')
        .attr('stroke-width', 1)
        .attr("opacity",0);

    contentContainer.append("defs")
        .append('pattern')
        .attr('id', 'deletedHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M 0,0, L200,200 M200,0 L0,200')
        .attr('stroke', '#ff0000')
        .attr('stroke-width', 1)
        .attr("opacity",1);


    let cell = row.selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

    cell.append('rect')
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("fill", function(d, i) {
            // console.log(d, i);
            // console.log(d.changeType === "inconsistent_change added");
         if (i && d) {
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
                    return "grey";
                } else if (d.changeType.indexOf("inconsistent_change") > -1) {
                    return "yellow";
                } else if (d.changeType.indexOf("consistent_change") > -1) {
                    return "blue";
                }
            }
        } else {
             return "white";
         }
        })

        cell.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr('stroke','black')
            .attr('stroke-width','1')
            .style('fill', function(d) {
                if (d) {
                    if (d.changeType.indexOf("same") > -1) {
                        return 'url(#emptyHatch)';
                    } else if (d.changeType.indexOf("added") > -1) {
                        return 'url(#diagonalHatch)';
                    } else if (d.changeType.indexOf("deleted") > -1) {
                        return 'url(#deletedHatch)';
                    }

                } else {
                    return 'url(#emptyHatch)'
                }
            })

            .on("mouseover", function(d){
                let msg = "<b>ChangeType: </b>" + d.changeType + "<br>";
                msg += "<b>CloneType: </b>" + d.cloneType;
                tooltip.html(msg);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})




    let labels = contentContainer.append('g')
        .attr('class', "labels");

    let rowLabels = labels.selectAll(".row-label")
        .data(classIds)
        .enter().append("g")
        .attr("class", "row-label")
        .attr("transform", function(d, i) { return "translate(15" + "," + y(i) + ")"; });

    rowLabels.append("text")
        .attr("x", 0)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d.id; });

}

