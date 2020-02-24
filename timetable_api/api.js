const axios = require('axios');
const parser = require('node-html-parser');
function request_course(course_code, term, year) {
    var term_code = 0;
    switch (term) {
        case "fall":
            term_code=9;
            break;
        case "winter":
            term_code=1;
            break;
        case "summer":
            term_code=5;
    }
    year_code = year + term_code;
    return axios.get('https://student.utm.utoronto.ca/timetable/timetable?session='+year_code+'&courseCode='+course_code);
}

function get_description(parsed) {
    return parsed.querySelector('.infoCourseDetails').childNodes[0].rawText.trim();
}

function make_lectures(rows) {
    var l = rows[0].length;
    var array = [];
    for (var i=0;i<l;i++) {
        array.push({'day':rows[0][i],
                    'start':rows[1][i],
                    'end':rows[2][i],
                    'room':rows[3][i]});
    }
    return array;
}

function get_info(row) {
    tags = ['lecture','instructor','cur_enrollment','max_enrollment','wait_list','ratio','sections']
    out = {};
    n = 0;
    tds = row.childNodes.filter(x=>x.tagName=='td');
    for (var i=1;i<tds.length;i=i+1) {
        txt = tds[i].structuredText.trim().split('\n');
        if (tags[n] == 'sections') {
            out[tags[n]] = make_lectures(tds.slice(i,tds.length).map(x=>x.structuredText.trim().split('\n')));
            break;
        } else {
            out[tags[n]] = txt[0];
        }
        n++;
    }
    return out;
}

function get_courses(parsed) {
    let tbody = parsed.querySelector('tbody');
    var out = [];
    for (var i=1;i<tbody.childNodes.length;i=i+2) {
        out.push(get_info(tbody.childNodes[i]));
    }
    return out;
}

function full_course(code, term, year) {
    let promise = request_course(code, term, year).then(response => {
        body = response.data.trim();
        parsed = parser.parse(body);
        return {'description':get_description(parsed),
                'courses':get_courses(parsed)};
    })
    .catch(error => {
        return null;
    });
    return promise;
}

full_course('CSC148','winter','2020').then(res => console.log(res));

module.exports = {
    query_course: full_course
}