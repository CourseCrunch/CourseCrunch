const axios = require('axios');

function number_of_instructors(school_id) {
    var query_str = process.env.INSTRUCTCOUNT.format(school_id);
    console.log(query_str);
    var promise = axios.get(query_str).then(res => {
        return res.data.response.numFound;
    }).catch(e => {
        return null;
    });
    return promise;
}

function query_all_instructors(school_id) {
    var promise = number_of_instructors(school_id).then(instruct_count => {
        var qs = process.env.Q_A_INSTRUCT.format(instruct_count, school_id);
        return axios.get(qs).then(res => {
            return res.data.response.docs;
        }).catch(e => {
            return null;
        });
    });
    return promise;
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

function get_schools() {
    return {
        'utm': '4928',
        'utsg': '1484',
        'utsc': '4919',
        'uoft': '12184',
        'rotman': '5281'
    };
}

module.exports = {
    get_schools,
    update_instructor_cache,
    query_all_instructors
}