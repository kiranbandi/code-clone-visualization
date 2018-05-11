import _ from 'lodash';
import convert from 'xml-js';

export default function(responseArray, cloneData) {
    let genealogyMapSource = {},
        genealogyMapTarget = {},
        xml2jsonData,
        jsonCollection = _.reduce(responseArray, (store, xml) => {
            xml2jsonData = convert.xml2js(xml.data, { compact: true, spaces: 0 }).genealogies;
            return store.concat(
                _.map(xml2jsonData.genealogy, (info) => {
                    info.source = xml2jsonData._attributes.version1;
                    info.target = xml2jsonData._attributes.version2;
                    return info;
                }));
        }, []);

    // simple genealogy collection 
    _.forEach(jsonCollection, (value, index) => {
        if (Array.isArray(value.class)) {
            if (value.class.length == 3) {
                // break;
            } else {
                let sourceKey = value.source + "@" + value.class[0]._attributes.id,
                    targetKey = value.target + "@" + value.class[1]._attributes.id;
                value.targetPresent = true;
                genealogyMapSource[sourceKey] = value;
                genealogyMapTarget[targetKey] = value;
            }
        }
        // These genealogies have dissapeared or split and 
        // so there is only source version info and thus only one class
        else {
            value.targetPresent = false;
            // if the file name has the source version name in it store the value in sourcemap else targetmap
            if (value.class.source[0]._attributes.file.indexOf(value.source) > -1) {
                genealogyMapSource[value.source + "@" + value.class._attributes.id] = value;
            } else {
                genealogyMapTarget[value.target + "@" + value.class._attributes.id] = value;
            }
        }
    })
    console.log('Link Files Processing Complete');
    return { genealogyMapSource, genealogyMapTarget };
}