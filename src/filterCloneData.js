import _ from 'lodash';

export default function(cloneData, minRange, maxRange) {

    let dataClone = _.cloneDeep(cloneData);

    let { genealogyList, deadGenealogyList, versionCount, uniqueVersionList } = dataClone,
    filteredVersionList = uniqueVersionList.slice(minRange - 1, maxRange);

    dataClone.uniqueVersionList = filteredVersionList;
    dataClone.versionCount = maxRange - minRange + 1;
    //  each genealogy is a collection of changePairs 
    //  we filter out and remove changePairs that dont fall in the range
    //  if we have a genealogy that is empty after the filtering then we remove the complete genealogy
    //  which is why we have two lodash filters nested one into the other
    dataClone.genealogyList = _.filter(genealogyList, filterChangeList.bind({ filteredVersionList, minRange, maxRange }));
    dataClone.deadGenealogyList = _.filter(deadGenealogyList, filterChangeList.bind({ filteredVersionList, minRange, maxRange }));
    return dataClone;

}

function filterChangeList(changeList) {
    changeList.serialList = changeList.serialList.slice(this.minRange - 1, this.maxRange);
    changeList.set = _.filter(changeList.set, (changePair) => {
        if ((this.filteredVersionList.indexOf(changePair.source.version) == -1) || (this.filteredVersionList.indexOf(changePair.target.version) == -1)) {
            return false;
        } else {
            return true;
        }
    });
    return (changeList.set.length > 0);
}