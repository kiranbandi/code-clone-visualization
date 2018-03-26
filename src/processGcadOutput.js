import _ from 'lodash'

// Unique version list - Global to this module
var uniqueVersionList = []

export default function (cloneResponse) {

    let responseArray = cloneResponse.data.split("\n"),
        projectName = responseArray[0].split("\\").slice(-1).join(),
        genealogyInfo = responseArray.slice(1, 5).join('\n'),
        versionCount = Number(genealogyInfo.split('\n')[0].slice(20));


    // Genealogy of every clone set is represented in a single line that starts with "[Version" so we look for every line that starts with that 
    // and then process that line and the next 7 lines following it as a bunch because they contain info regarding this clone set
    let lineIndex = 0,
        genealogyList = [];
    while (lineIndex < responseArray.length) {
        if (responseArray[lineIndex].indexOf('[Version') > -1) {
            let cloneClass = responseArray[lineIndex],
                parsedSet = splitAndParseCloneSet(responseArray[lineIndex]);
            if (parsedSet.length > 0) {
                genealogyList.push({
                    'set': parsedSet,
                    // Following 8 lines contain the information regarding that clone set genealogy so we store that and skip those lines
                    // to parse through the list faster
                    'info': responseArray.slice(lineIndex + 1, lineIndex + 8).join('\n')
                })
            }
            lineIndex += 7
        }
        // increase count by 1 , also taken into count  when we need to skip 8 lines , icremented 7 times inside if block and once outside
        lineIndex += 1;
    }
    // preprocess datalist for d3
    genealogyList = preProcessData(genealogyList)

    return { genealogyList, projectName, genealogyInfo, versionCount, uniqueVersionList };
}

function splitAndParseCloneSet(cloneSetString) {
    // Split the entire string by tab and then read through the list sequentially
    // since we will be getting the genealogy information between 2 clones at a time 
    // we will be grouping the result into clone sets so 1->2->3->4 would be grouped as [{1,2},{2,3},{3,4}]

    // If a segment has the string "version" in it it means it has the information regarding the clone 
    // and the next two segments are the change type and the next version of the clone
    // so we loop through the tab split list in groups of 3 segments
    let cloneSetStringSplit = cloneSetString.split('\t'),
        loopIndex = 0,
        changePairList = [];

    // ignored clone sets that have change type split or dissappeared  - TEMPORARY FIX !!
    if (cloneSetString.indexOf('split') > -1 || cloneSetString.indexOf('disappeared') > -1) {
        return [];
    }
    // Since we move through the list in sets of three we go forward only if the first segment has the string version in it 
    // and the segment following it is not empty 
    // to check if the string is not empty we use split and join trick to remove spaces and then check to see if it has length more than 1
    while ((loopIndex < cloneSetStringSplit.length) & (cloneSetStringSplit[loopIndex].indexOf('Version') > -1) & (cloneSetStringSplit[loopIndex + 1].split(' ').join('').length > 1)) {

        // for source and target remove the leading and trailing square brackets and split the segment using the comma inbetween
        let source = cloneSetStringSplit[loopIndex].slice(1, -1).split(','),
            changeType = cloneSetStringSplit[loopIndex + 1],
            target = cloneSetStringSplit[loopIndex + 2].slice(1, -1).split(',');
        // To get the version from the segment we isolate version by splitting with ':' and then get the second part 
        // we then remove spaces from this part using split and join  
        // To get  cloneType we just look for the last six characters in the segment from the last 
        // and for classId we split using space the second part after splitting with comma 
        // and then pick the number from the resulting list 

        let sourceVersion = source[0].split(':')[1].split(' ').join(''),
            targetVersion = target[0].split(':')[1].split(' ').join('');

        // Add source and target version to list of versions to keep track of all unique versions that have occured so far
        uniqueVersionList = _.union(uniqueVersionList, [sourceVersion, targetVersion]);

        changePairList.push({
            'source': {
                'version': sourceVersion,
                'cloneType': source[1].slice(-6),
                'classId': Number(source[1].split(" ").slice(-2, -1).join(''))
            },
            'target': {
                'version': targetVersion,
                'cloneType': target[1].slice(-6),
                'classId': Number(target[1].split(" ").slice(-2, -1).join(''))
            },
            'changeType': cloneSetStringSplit[loopIndex + 1]
        })
        loopIndex += 2
    }
    return changePairList;
}

// once we have gone through all the data we have the list of all unique version names that can appear 
// so we then use that to preprocess the genealogy set for d3 to make it easier for us to draw elements

function preProcessData(genealogyList) {

    // Create an empty list with version names and placeholder for clone types
    let cloneVersionList = uniqueVersionList.map((versionName) => { return { 'version_id': versionName, 'cloneType': '' } })

    let c = genealogyList.map((value,index)=>{

        



    })




    return genealogyList
}
