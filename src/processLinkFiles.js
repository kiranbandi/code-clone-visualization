import _ from 'lodash';
import convert from 'xml-js';

export default function(responseArray, cloneData) {

    let genealogyMap = {},
        jsonCollection = _.reduce(responseArray, (store, value) => {
            return store.concat(convert.xml2js(value.data, { compact: true, spaces: 0 }).genealogies.genealogy);
        }, []);

    // simple genealogy collection 
    _.forEach(jsonCollection, (value, index) => {

        if (Array.isArray(value.class)) {

            if (value.class.length == 3) {
                console.log(value._attributes.clone_group);
            } else {

                debugger;
            }
        }
        // These genealogies have dissapeared or split and 
        // so there is only source version info and thus only one class
        else {

        }

        // debugger;
        // let key = value._attributes.gid;
        // if (key in genealogyMap) {
        //     genealogyMap[key].push(value);
        // } else {
        //     genealogyMap[key] = [value];
        // }
    })


    console.log(cloneData.genealogyList.length + cloneData.deadGenealogyList.length);
}