import * as d3 from 'd3';
import axios from 'axios';

// Load the Data gff file and syteny collinearity file 
// Parse the Data and store it in appropriate data structures 
// Filter it for useful information and mine it to decide on what to represent 
// Create the plots 
// Refine the plots 
// Add interactivity to the plots 

// var genomeLibrary = new Map();
// var chromosomeMap = new Map();
// var allignmentStore = [];


// // Loading the synteny collinearity file
// axios.get('assets/files/collinear.collinearity').then(function (response) {
//     var storeIndex = -1,
//         allignment = {};
//     response.data.split('\n').forEach(function (line, index) {
//         if (line.length > 0) {
//             if (line.indexOf('#') > -1) {
//                 if (line.indexOf("Alignment") > -1) {
//                     storeIndex++;
//                     var line = line.split(' ');
//                     allignment.score = Number(line[3].split("=")[1]);
//                     allignment.eValue = line[4].split("=")[1];
//                     allignment.count = Number(line[5].split("=")[1]);
//                     allignment.source = Number(line[6].split("&")[0].slice(2));
//                     allignment.target = Number(line[6].split("&")[1].slice(2));
//                     allignment.type = line[7];
//                     allignment.list = [];
//                     allignmentStore[storeIndex] =allignment;
//                 }
//             } else {
//                 // A set of allignments each one has information on sourceChr and TargetChr , score , insertion or deletion , number of gene allignments
//                 line=line.split("\t");
//                 allignmentStore[storeIndex].list.push({'source':line[1],'target':line[2],score:line[3]});
//             }
//         }
//     })
// }).catch(function () {
//     console.log("There was an error in loading the collinearity file");
// })

console.log("Enter Code Setup")