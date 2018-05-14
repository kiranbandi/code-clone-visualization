import axios from 'axios';
import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import _ from 'lodash';
import { blueColor, redColor, greenColor, purpleColor } from './colors';
import cloneMap from './cloneMap';
import legend from './legend';
import slider from './slider';

export default function() {

    let linkPromises = [];
    _.forEach([1, 2, 3], (entry) => { linkPromises.push(axios.get('assets/files/brlcad/type' + entry + "clones.csv")) });

    axios.all(linkPromises)
        .then((response) => {

            let globalMap = {},
                versionStore = [],
                genealogyList = [];

            _.each(response, (value, index) => {
                _.each(d3.csvParse(value.data), (row) => {
                    // convert strings to number 
                    row.revision = Number(row.revision);
                    row.globalcloneid = Number(row.globalcloneid);

                    let key = row.globalcloneid;
                    row.cloneType = index + 1;
                    if (versionStore.indexOf(row.revision) == -1) {
                        versionStore.push(row.revision);
                    }
                    if (key in globalMap) {
                        globalMap[key].push(row);
                    } else {
                        globalMap[key] = [row];
                    }
                })
            })

            // sort all versions
            versionStore.sort();
            // group all the values for a given global cloneId on the basis of revisions
            _.each(globalMap, (cloneListForId, globalCloneId) => {
                let versionMap = {};
                _.each(cloneListForId, (cloneInfo) => {
                    if (cloneInfo.revision in versionMap) {
                        versionMap[cloneInfo.revision].push(cloneInfo);
                    } else {
                        versionMap[cloneInfo.revision] = [cloneInfo];
                    }
                })
                genealogyList.push({ globalCloneId, versionMap, versionStore })
            })

            console.log("Number of Genealogies Found : " + genealogyList.length);
            generateCircularPlot(genealogyList, versionStore);

            d3.select('.filterPanelSPCP').classed('hide', false);
            d3.select('.LoadingTitle').classed('hide', true);

            let minRange = 1,
                maxRange = versionStore.length;

            // initialize slider 
            slider('#sliderContainerSPCP', minRange, maxRange, maxRange, true, (min, max) => {
                minRange = min;
                maxRange = max;
            });

            // tab switch implementation - show hide depending on button press , by default only description is shown
            d3.select('#recreatePlotSPCP').on('click', () => {

                let filteredversionStore = versionStore.slice(minRange - 1, maxRange);
                d3.select('.filterPanelSPCP').classed('hide', true);
                d3.select('.LoadingTitle').classed('hide', false);
                generateCircularPlot(genealogyList, filteredversionStore);
                d3.select('.filterPanelSPCP').classed('hide', false);
                d3.select('.LoadingTitle').classed('hide', true);
            })

        })
        .catch(function(error) {
            console.log(error);
            alert("SPCP Miner Data not ");
        });

    return true;
}

function generateCircularPlot(genealogyList, versionStore) {

    let versionCount = versionStore.length;

    let { clientWidth } = document.body,
        squareRange = clientWidth < window.innerHeight ? clientWidth : window.innerHeight,
        width = squareRange,
        radius = width / 2;

    let spcpMainContainer = d3.select('#root .spcpContainer');

    if (spcpMainContainer.node()) {
        spcpMainContainer.selectAll('*').remove();
    } else {
        spcpMainContainer = d3.select('#spcp-root').append('div').attr('class', 'spcpContainer');
        // add the legend at the top before rendering the actual plot 
        legendCloneType('#spcp-root');
    }

    spcpMainContainer.style("width", width + 'px');

    let spcpCircularSVG = spcpMainContainer.append('svg')
        .attr('class', 'spcpCircularSVG')
        .attr('height', width)
        .attr('width', width)

    // set constants
    let PI = Math.PI,
        arcMin = (radius / versionCount) * 0.5,
        arcPadding = (radius / versionCount) * 0.25,
        versionCountUpdate = versionCount + 0.25,
        arcAnglePadding = 0.05 * (360 / genealogyList.length);

    spcpCircularSVG.append('g')
        .attr('class', 'centeredGraphicSPCP')
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
                .data(versionStore)
                .enter()
                .filter(function(d) { return !!data.versionMap[d] })
                .append('path')
                .attr('class', 'changeArc')
                .attr("d", d3.arc()
                    .innerRadius(function(d, i) {
                        return arcMin + (((radius / versionCountUpdate) * _.indexOf(versionStore, data.versionMap[d][0].revision)) + (radius / (versionCountUpdate * 2)));
                    })
                    .outerRadius(function(d, i) {
                        return arcMin + (((radius / versionCountUpdate) * _.indexOf(versionStore, data.versionMap[d][0].revision)) + (radius / (versionCountUpdate * 2))) + (radius / versionCountUpdate) - arcPadding;
                    })
                    .startAngle(index * (360 / genealogyList.length) * (PI / 180))
                    .endAngle((((index + 1) * (360 / genealogyList.length) - arcAnglePadding) * (PI / 180))))
                .attr('fill', (d) => {
                    let cloneType = data.versionMap[d][0].cloneType;
                    return cloneType == 1 ? 'green' : cloneType == 2 ? 'blue' : 'red';
                })
        })
}



// code for clone type legend
function legendCloneType(rootId) {

    let legends = [
            ['green', 'CLONE TYPE 1'],
            ['blue', 'CLONE TYPE 2'],
            ['red', 'CLONE TYPE 3']
        ],
        globalLegendRoot = d3.select(rootId);

    let globalLegends = globalLegendRoot.append('div')
        .attr('class', 'legendContainer')
        .selectAll('.globalLegend')
        .data(legends)
        .enter()
        .each(function(legend) {
            let legendBox = d3.select(this).append('div')
                .attr('class', 'globalLegendBox')
                .style('width', () => {
                    if (document.body.clientWidth < 500) {
                        return '100%';
                    } else {
                        return ((100 / legends.length) + '%')
                    }
                })

            legendBox.append('div')
                .attr('class', 'globalLegend')
                .style("background", (d) => d[0]);

            legendBox.append('span')
                .attr('class', 'globalLegendText')
                .text((d) => d[1]);
        })

}