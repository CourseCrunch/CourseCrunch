const axios = require('axios');
const mongo = require('./Instruct');
const Fuse = require('fuse.js');

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

function number_of_instructors(school_id) {
    var query_str = 'https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=0&wt=json&q=*%3A*+AND+schoolid_s%3A'+school_id+'&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&start=0&fl=pk_id'
    var promise = axios.get(query_str).then(res => {
        return res.data.response.numFound;
    }).catch(e => {
        return null;
    });
    return promise;
}

function query_all_instructors(school_id) {
    var promise = number_of_instructors(school_id).then(instruct_count => {
        return Promise.resolve('https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows='+instruct_count+'&wt=json&q=*%3A*+AND+schoolid_s%3A'+school_id+'&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+teacherdepartment_s');
    }).then(qs => {
        return axios.get(qs).then(res => {
            return res.data.response.docs;
        }).catch(e => {
            return null;
        });
    });
    return promise;
}

function query_instructor(iid) {
    var query_str = 'https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=1&wt=json&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&q=*%3A*+AND+pk_id%3A'+iid+'&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+averageeasyscore_rf+averageclarityscore_rf+tag_s_mv+averagehelpfulscore_rf+teacherdepartment_s';
    return axios.get(query_str).then(res => {
        if (res.data.response.docs.length != 0) return res.data.response.docs[0];
        return null;
    }).catch(e => {
        return null;
    });
}

function get_schools() {
    return {
        'utm': '4928',
        'utsg': '1484',
        'utsc': '4919',
        'uoft': '12184',
        'rotman': '5281'
    };
}

function update_instructor_cache() {
    var schools = get_schools();
    for (let key in schools) {
        query_all_instructors(schools[key]).then(res => {
            for (var i=0;i<res.length;i++) {
                var row = res[i]
                row['fullname'] = row['teacherfirstname_t'] + ' ' + row['teacherlastname_t'];
                row['school'] = key;
                let doc = mongo.Instruct(row);
                doc.save((err,result) => {
                    if (err) {
                        return null;
                    }
                });
            }
        }).catch(e => {
            return;
        })
    }
}

let fuse_global = null;

function get_fuse() {
    if (fuse_global == null) {
        return mongo.Instruct.find().then(res => {
            fuse_global = new Fuse(res, options);
            fuse_global['uid'] = Math.random();
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
    })
}

fuzzy_search('Bailey Lee').then(res => {
    console.log(res[0]);
});

fuzzy_search('Daniel Zingaro').then(res => {
    console.log(res[0]);
});

fuzzy_search('Lisa Zhang').then(res => {
    console.log(res[0]);
});

module.exports = {
    find_instructor: query_instructor,
    find_all_instructors: query_all_instructors,
    all_schools: get_schools,
    init: update_instructor_cache,
    find_instructor: fuzzy_search
}