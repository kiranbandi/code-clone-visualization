import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import axios from 'axios';
import _ from 'lodash';
import processGcadOutput from './processGcadOutput';
import circularMap from './circularMap';
import matrix from './matrix';
import cloneMap from './cloneMap';
import { blueColor, redColor, greenColor, grayColor } from './colors';


// Temporary params fix to test mutltiple input files 
let fileParamMapper = {
    'argo': 'gcad_argo_uml_output.txt',
    'wget': 'gcad_wget_output.txt',
    'argo2': 'gcad_argo_2_uml_output.txt',
    'wget2': 'gcad_wget_2_output.txt'
}
const getParams = query => {
    if (!query) {
        return {};
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};

axios.get('assets/files/' + fileParamMapper[getParams(window.location.search).source]).then(function (response) {

    let cloneData = processGcadOutput(response),
        cloneDataCopy = _.clone(cloneData);

    //  intial information regarding the project  , its version count and the gcad paramters
    d3.select('#root').append('div').attr('class', 'SubHeadingTitleContainer')
    d3.select('.SubHeadingTitleContainer').append('h3').attr('class', 'SubHeadingTitle').text('Project Name : ' + cloneData.projectName);
    cloneData.genealogyInfo.split('\n').map((content) => d3.select('.SubHeadingTitleContainer').append('h3').attr('class', 'SubHeadingTitle').text(content))

    // code for clone change type legend
    let legends = [[greenColor, 'no change'], [blueColor, 'consistent change'], [redColor, 'inconsistent change']],
        globalLegends = d3.select('#root').append('div')
            .attr('class', 'legendContainer')
            .selectAll('.globalLegend')
            .data(legends)
            .enter()
            .each(function (legend) {
                let legendBox = d3.select(this).append('div')
                    .attr('class', 'globalLegendBox')
                    .style('width', () => {
                        if (document.body.clientWidth < 500) {
                            return '100%';
                        }
                        else {
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

    // calling circular map 
    d3.select('#root').append('h3').attr('class', 'SubHeadingTitle plotTitle').text('Circos Plot - Representation of Change Patterns in Clones');
    circularMap(cloneData);
    // calling clone map for first element - first set as default 
    cloneDataCopy.genealogyList = cloneDataCopy.genealogyList.slice(0, 1);
    cloneMap(cloneDataCopy);
    // calling linear map 
    d3.select('#root').append('h3').attr('class', 'SubHeadingTitle plotTitle').text('Scatter Plot - Representation of Change Patterns in Clones');
    matrix(cloneData);

}).catch(function (error) {
    console.log(error)
    console.log("There was an error in loading the clone genealogy file");
})




