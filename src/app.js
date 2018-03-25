import * as d3 from 'd3';
import axios from 'axios';
import processGcadOutput from './processGcadOutput';

// Loading the synteny collinearity file
axios.get('assets/files/gcad_argo_uml_output.txt').then(function (response) {

    let processedCloneData = processGcadOutput(response);
    console.log(processedCloneData);

}).catch(function (error) {
    console.log(error)
    console.log("There was an error in loading the clone genealogy file");
})
