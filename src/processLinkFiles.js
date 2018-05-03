import _ from 'lodash';
import convert from 'xml-js';

export default function(responseArray) {

    _.forEach(responseArray, (value, index) => {
        var linkData = convert.xml2js(value.data, { compact: true, spaces: 0 });
    })
}