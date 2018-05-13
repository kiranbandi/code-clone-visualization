// Change visualisation for each individual genealogy for a given source or target version
export default function(d3container, dataNode, linkGenealogy, headerContent) {

    let changeSubContainer = d3container.append('div').attr('class', 'changeSubContainer');

    changeSubContainer.append('h3')
        .attr('class', 'descriptionContainerHeader SubHeadingTitle plotTitle')
        .text("Change Description for " + headerContent);

    changeSubContainer.append('h3')
        .attr('class', 'descriptionContainerHeader SubHeadingTitle plotTitle')
        .text(sanitizeChangeType(dataNode.changeType));

    let sourceCloneContainer = changeSubContainer.append('div')
        .attr('class', 'sourceCloneContainer cloneDescriptionContainer'),
        targetCloneContainer = changeSubContainer.append('div')
        .attr('class', 'targetCloneContainer cloneDescriptionContainer');


    sourceCloneContainer.append('h3').attr('class', 'descriptionHeader').text('source');
    targetCloneContainer.append('h3').attr('class', 'descriptionHeader').text('target');
    sourceCloneContainer.append('p').text('Version : ' + dataNode.source.version);
    sourceCloneContainer.append('p').text('Clone Type : ' + dataNode.source.cloneType);
    sourceCloneContainer.append('p').text('Class ID : ' + dataNode.source.classId);
    targetCloneContainer.append('p').text('Version : ' + dataNode.target.version);
    targetCloneContainer.append('p').text('Clone Type : ' + dataNode.target.cloneType);
    targetCloneContainer.append('p').text('Clone Class ID : ' + dataNode.target.classId);

    let sourceGenealogyKey = dataNode.source.version + '@' + dataNode.source.classId,
        targetGenealogyKey = dataNode.target.version + '@' + dataNode.target.classId,
        { genealogyMapSource, genealogyMapTarget } = linkGenealogy,
        genealogyInfo = genealogyMapSource[sourceGenealogyKey] || genealogyMapTarget[targetGenealogyKey] || false;


    if (genealogyInfo) {
        changeSubContainer.append('h3')
            .attr('class', 'SubHeadingTitle plotTitle historyTitle')
            .text('Detailed Description');
        // .text('Detailed Description ' + ", Genealogy ID : " + genealogyInfo._attributes.gid);

    } else {
        changeSubContainer.append('h3')
            .attr('class', 'SubHeadingTitle plotTitle historyTitle').text('Detailed Data for ' + headerContent + ' not available');
        return;
    }

    let detailedContainer = changeSubContainer.append('div').attr('class', 'detailedContainer');

    let sourcedetailedContainer = detailedContainer.append('div')
        .attr('class', 'cloneDescriptionContainer'),
        targetdetailedContainer = detailedContainer.append('div')
        .attr('class', 'cloneDescriptionContainer');

    if (genealogyInfo.multiClass) {

        sourcedetailedContainer.append('p').text('Number of Lines : ' + genealogyInfo.class[0]._attributes.nlines);
        sourcedetailedContainer.append('p').text('Number of Fragments : ' + genealogyInfo.class[0]._attributes.nfragments);
        sourcedetailedContainer.append('h3').attr('class', 'descriptionHeader').text('Source Fragments');
        _.each(genealogyInfo.class[0].source, (sourceValue) => {
            let fragment = sourcedetailedContainer.append('div').attr('class', 'fragmentContainer');
            fragment.append('p').text('File : ' + sourceValue._attributes.file + " , " + 'Start Line Number : ' + sourceValue._attributes.startline + "," + ' End Line Number : ' + sourceValue._attributes.endline);
        });

        targetdetailedContainer.append('p').text('Number of Lines : ' + genealogyInfo.class[1]._attributes.nlines);
        targetdetailedContainer.append('p').text('Number of Fragments : ' + genealogyInfo.class[1]._attributes.nfragments);
        targetdetailedContainer.append('h3').attr('class', 'descriptionHeader').text(' Target Fragments');
        _.each(genealogyInfo.class[1].source, (targetValue) => {
            let fragment = targetdetailedContainer.append('div').attr('class', 'fragmentContainer');
            fragment.append('p').text('File : ' + targetValue._attributes.file + " , " + 'Start Line Number : ' + targetValue._attributes.startline + "," + ' End Line Number : ' + targetValue._attributes.endline);
        });

    }

}

function sanitizeChangeType(changeInfo) {
    let change = changeInfo.split(" "),
        changeType = change[0].split("_").join(" "),
        fragmentChange = change[1].split("_").join(" ");
    return "Change Type : " + changeType + " , Clone Fragments Change : " + fragmentChange;
}