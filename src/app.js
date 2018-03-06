import * as d3 from 'd3';
import axios from 'axios';
import convert from 'xml-js';

console.log("Enter Code Setup")

// Loading the synteny collinearity file
axios.get('assets/files/clone.xml').then(function (response) {

    var cloneData = convert.xml2js(response.data, { compact: true, spaces: 0 });
    console.log(cloneData);

}).catch(function () {
    console.log("There was an error in loading the clone XML file");
})

