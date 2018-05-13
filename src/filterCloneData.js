import _ from 'lodash';

export default function(cloneData, filterOptions) {

    let dataClone = _.cloneDeep(cloneData),
        { genealogyList, deadGenealogyList, versionCount, uniqueVersionList } = dataClone,
        { minRange, maxRange, includeDeadGenealogies } = filterOptions;

    // includeDeadGenealogies flag tells if users wishes to view the dead and split genealogy list
    genealogyList = genealogyList.concat(includeDeadGenealogies ? deadGenealogyList : []);
    dataClone.uniqueVersionList = uniqueVersionList.slice(minRange - 1, maxRange);
    dataClone.versionCount = maxRange - minRange + 1;

    //  each genealogy is a collection of changePairs 
    //  we filter out and remove changePairs that dont fall in the range
    dataClone.genealogyList = _.filter(genealogyList, (changeList) => {
        changeList.serialList = changeList.serialList.slice(minRange - 1, maxRange);
        changeList.set = _.filter(changeList.set, (changePair) => {
            return ((dataClone.uniqueVersionList.indexOf(changePair.source.version) != -1) && (dataClone.uniqueVersionList.indexOf(changePair.target.version) != -1))
        });
        //  if we have a genealogy that is empty after the filtering then we remove the complete genealogy
        //  which is why we have two lodash filters nested one into the other
        return (changeList.set.length > 0);
    });
    return dataClone;

}