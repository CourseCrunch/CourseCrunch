const axios = require('axios');
const mongo = require('./Instruct');
const Fuse = require('fuse.js');
const cache = require('./Cache');

if (!String.prototype.format) {
    String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
        });
    };
}

function query_instructor(iid) {
    var query_str = process.env.Q_INSTRUCT.format(iid);
    return axios.get(query_str).then(res => {
        if (res.data.response.docs.length != 0) return res.data.response.docs[0];
        return null;
    }).catch(e => {
        return null;
    });
}

var options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.6,
    location: 0,
    tokenize: true,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "fullname"
    ]
};

let fuse_global = null;

function get_fuse() {
    if (fuse_global == null) {
        return mongo.Instruct.find().then(res => {
            fuse_global = new Fuse(res, options);
            return fuse_global;
        }).catch(e => {
            return null;
        });
    } else {
        return Promise.resolve(fuse_global);
    }
}

function fuzzy_search(instructor_name) {
    return get_fuse().then(f => {
        return f.search(instructor_name);
    }).catch(e => {
        return null;
    });
}

fuzzy_search("Bailey Lee").then(r => console.log(r[0]));

module.exports = {
    find_instructor: query_instructor,
    find_all_instructors: cache.query_all_instructors,
    all_schools: cache.get_schools,
    init: cache.update_instructor_cache,
    find_instructor: fuzzy_search
}