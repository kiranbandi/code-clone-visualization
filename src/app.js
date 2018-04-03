import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import axios from 'axios';
import _ from 'lodash';
import processGcadOutput from './processGcadOutput';
import cloneMap from './cloneMap';
import circularMap from './circularMap';
import matrix from './matrix';

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

    let cloneData = processGcadOutput(response);

    //  intital heading code setup 
    d3.select('#root').append('div').attr('class', 'SubHeadingTitleContainer')
    d3.select('.SubHeadingTitleContainer').append('h3').attr('class', 'SubHeadingTitle').text('Project Name : ' + cloneData.projectName);
    cloneData.genealogyInfo.split('\n').map((content) => d3.select('.SubHeadingTitleContainer').append('h3').attr('class', 'SubHeadingTitle').text(content))

    d3.select('#root').append('h3').attr('class', 'SubHeadingTitle plotTitle').text('Radial Plot - Representation of Change Pattern in Clones');
    circularMap(cloneData);

    d3.select('#root').append('h3').attr('class', 'SubHeadingTitle plotTitle').text('Scatter Plot - Representation of Change Pattern in Clones');
    matrix(cloneData);

}).catch(function (error) {
    console.log(error)
    console.log("There was an error in loading the clone genealogy file");
})




