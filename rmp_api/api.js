const axios = require('axios');

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
        //console.log(instruct_count);
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
        //console.log(res.data.response.docs.length);
        if (res.data.response.docs.length != 0) return res.data.response.docs[0];
        //console.log('hi');
        return null;
    }).catch(e => {
        //console.log('hi');
        return null;
    });
}

// number_of_instructors('4928').then(res => {
//     console.log(res);
// })

// query_all_instructors('4928').then(res => {
//     console.log(res);
// });

// query_instructor('1707').then(res => {
//     console.log(res);
// }).catch(e => {
//     console.log(res);
// })

module.exports = {
    find_instructor: query_instructor,
    find_all_instructors: query_all_instructors
}