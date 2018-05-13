import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor, purpleColor } from './colors';
import cloneMap from './cloneMap';
import legend from './legend';

export default function(cloneData, linkGenealogy, filterOptions = {}) {

    let { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList } = cloneData, { clientWidth } = document.body,
        squareRange = clientWidth < window.innerHeight ? clientWidth : window.innerHeight,
        width = squareRange,
        radius = width / 2,
        includeDeadGenealogies = filterOptions.includeDeadGenealogies || false;

    let circularMainContainer = d3.select('#root .circularMainContainer');

    if (circularMainContainer.node()) {
        circularMainContainer.selectAll('*').remove();
        d3.select('.mainContainer').remove();
    } else {
        circularMainContainer = d3.select('#circos-root').append('div').attr('class', 'circularMainContainer');
        // add the legend at the top before rendering the actual plot 
        legend('#circos-root');
    }

    if (includeDeadGenealogies) {
        // toggle to view the dead and split genealogy list
        genealogyList = genealogyList.concat(cloneData.deadGenealogyList);
    }

    circularMainContainer.style("width", width + 'px');

    let circularRootSVG = circularMainContainer.append('svg')
        .attr('class', 'circularRootSVG')
        .attr('height', width)
        .attr('width', width)

    // set constants
    let PI = Math.PI,
        arcMin = (radius / versionCount) * 0.5,
        arcPadding = (radius / versionCount) * 0.25,
        versionCountUpdate = versionCount + 0.25,
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
        .each(function(data, index) {
            d3.select(this)
                .attr('class', 'arcIndex-' + index)
                .selectAll('.changeArc')
                .data(data.set)
                .enter()
                .append('path')
                .attr('class', 'changeArc')
                .attr("d", d3.arc()
                    .innerRadius(function(d, i) {
                        return arcMin + (((radius / versionCountUpdate) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCountUpdate * 2)));
                    })
                    .outerRadius(function(d, i) {
                        return arcMin + (((radius / versionCountUpdate) * _.indexOf(uniqueVersionList, d.source.version)) + (radius / (versionCountUpdate * 2))) + (radius / versionCountUpdate) - arcPadding;
                    })
                    .startAngle(index * (360 / genealogyList.length) * (PI / 180))
                    .endAngle((((index + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180))))
                .attr('fill', (d, i) => {
                    return d.changeType.indexOf('no_change') > -1 ? greenColor : d.changeType.indexOf('inconsistent_change') > -1 ? redColor : blueColor;
                })

            if (index == 0) {
                d3.select(this)
                    .append('path')
                    .attr('class', 'selected-index-arc')
                    .attr("d", d3.arc()
                        .innerRadius(function(d, i) {
                            return arcMin + radius - (radius / (2.0 * versionCount));
                        })
                        .outerRadius(function(d, i) {
                            return arcMin + radius - (radius / (1.25 * versionCount));
                        })
                        .startAngle(index * (360 / genealogyList.length) * (PI / 180))
                        .endAngle((((index + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180))))
                    .attr('fill', purpleColor)
            }

        })
        .on("mouseover", function(d) {

            // create Tooltip 
            let c_info = circularRootSVG._groups[0][0].getBoundingClientRect();
            let c_tooltip_info = tooltip._groups[0][0].getBoundingClientRect();
            let t_y1 = event.pageY;
            let t_x1 = event.pageX;

            //adjust circular tooltip
            if (t_x1 >= c_info.width / 2 + c_info.left) {
                t_x1 -= c_tooltip_info.width;
            }
            if (t_y1 >= c_info.height) {
                t_y1 -= c_tooltip_info.height;
            }
            tooltip.style("top", (t_y1) + "px").style("left", (t_x1) + "px");

            // create a higlight arc to indicate graphic being hovered upon
            let arcIndex = parseInt(d3.select(this).attr('class').split('-')[1]);
            d3.select(this)
                .append('path')
                .attr('class', 'changeArc-pointer')
                .attr("d", d3.arc()
                    .innerRadius(function(d, i) {
                        return arcMin + radius - (radius / (2.0 * versionCount));
                    })
                    .outerRadius(function(d, i) {
                        return arcMin + radius - (radius / (1.25 * versionCount));
                    })
                    .startAngle(arcIndex * (360 / genealogyList.length) * (PI / 180))
                    .endAngle((((arcIndex + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180))))
                .attr('fill', 'red')
                // Adding tooltip on hover
            tooltip.html(d.info.replace(/\n/g, '<br />'));
            return tooltip.style("visibility", "visible");

        })
        .on("click", function(d) {

            // remove previously highlighted arc
            d3.select('.selected-index-arc').remove();

            // create a higlight arc to indicate graphic being hovered upon
            let clickedArcIndex = parseInt(d3.select(this).attr('class').split('-')[1]);
            d3.select(this)
                .append('path')
                .attr('class', 'selected-index-arc')
                .attr("d", d3.arc()
                    .innerRadius(function(d, i) {
                        return arcMin + radius - (radius / (2.0 * versionCount));
                    })
                    .outerRadius(function(d, i) {
                        return arcMin + radius - (radius / (1.25 * versionCount));
                    })
                    .startAngle(clickedArcIndex * (360 / genealogyList.length) * (PI / 180))
                    .endAngle((((clickedArcIndex + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180))))
                .attr('fill', purpleColor)


            cloneMap({ 'genealogy': [d], versionCount, uniqueVersionList }, linkGenealogy);
        })
        .on("mouseout", function() {
            d3.selectAll('path.changeArc-pointer').remove();
            return tooltip.style("visibility", "hidden");
        })
}