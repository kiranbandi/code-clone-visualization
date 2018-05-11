import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import axios from 'axios';
import _ from 'lodash';
import processGcadOutput from './processGcadOutput';
import processLinkFiles from './processLinkFiles';
import circularMap from './circularMap';
import matrix from './matrix';
import cloneMap from './cloneMap';
import { blueColor, redColor, greenColor, grayColor } from './colors';
import { sampleSourceMapper } from './sampleSourceMapper';


// tab switch implementation - show hide depending on button press , by default only description is shown
d3.selectAll('#tab-switch-container > button').on('click', () => {
    let button_id = d3.event.target.id;
    d3.selectAll('#root > div ').classed('hide', true);
    d3.selectAll('#' + button_id.split('button-')[1]).classed('hide', false);
})

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

// get project source name from the url params , default is set to wget2
let projectSource = sampleSourceMapper[getParams(window.location.search).source] || sampleSourceMapper['wget2'];

axios.get('assets/files/' + projectSource.root).then(function(response) {

    let cloneData = processGcadOutput(response),
        linkPromises = [];

    //  intial information regarding the project  , its version count and the gcad paramters
    let subHeadingContainer = d3.select('#project-description')
    subHeadingContainer.append('h3').attr('class', 'SubHeadingTitle').text('Project Name : ' + cloneData.projectName);
    cloneData.genealogyInfo.split('\n').map((content) => subHeadingContainer.append('h3').attr('class', 'SubHeadingTitle').text(content))

    // get link data
    if (projectSource.link) {

        _.forEach(cloneData.uniqueVersionList, function(entry, index) {
            if (index <= (cloneData.uniqueVersionList.length - 2)) {
                linkPromises.push(axios.get('assets/files/' + projectSource.link + "/" + (cloneData.uniqueVersionList[index] + "_" + cloneData.uniqueVersionList[index + 1]) + ".xml"))
            }
        })

        axios.all(linkPromises)
            .then((response) => {
                processLinkFiles(response, cloneData);
            })
            .catch(function(error) {
                console.log(error);
                alert("Some of the genealogy link files are not available , Please try again");
            });
    }

    // calling circular map 
    circularMap(cloneData);
    // calling linear map 
    matrix(cloneData);

}).catch(function(error) {
    console.log(error);
    alert("There was an error in loading the clone genealogy file , Please try again");
})