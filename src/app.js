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
import slider from './slider';

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

    // get link data
    if (projectSource.link) {
        _.forEach(cloneData.uniqueVersionList, function(entry, index) {
            if (index <= (cloneData.uniqueVersionList.length - 2)) {
                linkPromises.push(axios.get('assets/files/' + projectSource.link + "/" + (cloneData.uniqueVersionList[index] + "_" + cloneData.uniqueVersionList[index + 1]) + ".xml"))
            }
        })

        axios.all(linkPromises)
            .then((response) => {
                let linkGenealogy = processLinkFiles(response, cloneData);
                start(cloneData, linkGenealogy);
            })
            .catch(function(error) {
                console.log(error);
                alert("Some of the genealogy link files are not available , Please try again");
                start(cloneData);
            });
    }


}).catch(function(error) {
    console.log(error);
    alert("There was an error in loading the clone genealogy file , Please try again");
})

function start(cloneData, linkGenealogy = {}) {
    //  intial information regarding the project  , its version count and the gcad paramters
    let subHeadingContainer = d3.select('#project-description')
    subHeadingContainer.select('h3').remove();
    subHeadingContainer.append('h3').attr('class', 'SubHeadingTitle').text('Project Name : ' + cloneData.projectName);
    cloneData.genealogyInfo.split('\n').map((content) => subHeadingContainer.append('h3').attr('class', 'SubHeadingTitle').text(content))

    let minRange = 1,
        maxRange = cloneData.versionCount + 1;

    // initialize slider 
    slider(minRange, maxRange, cloneData.versionCount, (min, max) => {
        minRange = min - 1;
        maxRange = max - 1;
    });

    // tab switch implementation - show hide depending on button press , by default only description is shown
    d3.selectAll('#recreatePlot').on('click', () => {

        circularMap(cloneData, linkGenealogy);

    })

    // calling circular map 
    circularMap(cloneData, linkGenealogy);
    // calling linear map 
    matrix(cloneData, linkGenealogy);

}