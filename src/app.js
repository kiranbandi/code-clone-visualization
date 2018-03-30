import * as d3 from 'd3';
import { symbol, symbolCircle, symbolSquare, symbolTriangle, symbolStar } from "d3-shape";
import axios from 'axios';
import _ from 'lodash';
import processGcadOutput from './processGcadOutput';
import cloneMap from './cloneMap';
import circularMap from './circularMap';

// gcad_argo_uml_output or gcad_wget_output
// Loading the synteny collinearity file
axios.get('assets/files/gcad_argo_uml_output.txt').then(function (response) {

    let cloneData = processGcadOutput(response);
    circularMap(cloneData);
    cloneMap(cloneData);

}).catch(function (error) {
    console.log(error)
    console.log("There was an error in loading the clone genealogy file");
})
