/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

function _replaceKeys(source, names) {
    Object.keys(source).forEach((e) => {
        if (e in names) {
            source[names[e]] = source[e];
            delete source[e];
        }
    });
    return source;
}

function replaceKeys(source, names) {
    Object.keys(source._doc).forEach((e) => {
        if (e in names) {
            source._doc[names[e]] = source[e];
            delete source._doc[e];
        }
    });
    return _replaceKeys(source._doc, names);
}


module.exports = {
    replaceKeys,
    _replaceKeys,
};
