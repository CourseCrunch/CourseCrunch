/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

function replaceKeys(source, names) {
    Object.keys(source._doc).forEach((e) => {
        if (e in names) {
            source._doc[names[e]] = source[e];
            delete source._doc[e];
        }
    });
    return source;
}

module.exports = {
    replaceKeys,
};
