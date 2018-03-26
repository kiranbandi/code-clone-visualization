import * as d3 from 'd3';
import axios from 'axios';
import _ from 'lodash';
import processGcadOutput from './processGcadOutput';


// Loading the synteny collinearity file
axios.get('assets/files/gcad_argo_uml_output.txt').then(function (response) {

    let processedCloneData = processGcadOutput(response);
    var dataList = processedCloneData.genealogyList.slice(0, 5);

    let height = 1500;
    let marginPadding = 80;
    let width = document.body.clientWidth - marginPadding;

    var mainContainer = d3.select('#root').append('div')
    mainContainer.attr('class', 'mainContainer')
        .style("width", width + 'px')
        .style("height", height + 'px');

    var versionNameContainer = mainContainer.append('div')
        .attr('class', 'versionNameContainer')
        .selectAll('h2')
        .data(processedCloneData.uniqueVersionList)
        .enter()
        .append('h2')
        .style("width", width / 3 + 'px')
        .text((d) => d)

    debugger;

    // var contentContainer = mainContainer.append('svg')
    //     .attr('class', 'contentContainer')
    //     .attr('height', height)
    //     .attr('width', width)

    // var genealogySetGroup = contentContainer.selectAll('g')
    //     .data(dataList)
    //     .enter()
    //     .append('g')
    //     .attr('transform', (d,i) => "translate(0,"+100*i+")")





}).catch(function (error) {
    console.log(error)
    console.log("There was an error in loading the clone genealogy file");
})
