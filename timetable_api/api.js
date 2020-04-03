const axios = require('axios');
const parser = require('node-html-parser');

function requestCourse(courseCode, term, year) {
    let termCode = 0;
    switch (term) {
    case 'fall':
        termCode = 9;
        break;
    case 'winter':
        termCode = 1;
        break;
    case 'summer':
        termCode = 5;
        break;
    default:
        termCode = 2;
    }
    const yearCode = year + termCode;
    return axios.get(`https://student.utm.utoronto.ca/timetable/timetable?session=${yearCode}&courseCode=${courseCode}`);
}

function getDescription(parsed) {
    return parsed.querySelector('.infoCourseDetails').childNodes[0].rawText.trim();
}

function getName(parsed) {
    return parsed.querySelector('.course').querySelector('span').childNodes[0].rawText.trim();
}

function makeLectures(rows) {
    const l = rows[0].length;
    const array = [];
    for (let i = 0; i < l; i += 1) {
        array.push({
            day: rows[0][i],
            start: rows[1][i],
            end: rows[2][i],
            room: rows[3][i],
        });
    }
    return array;
}

function getInfo(row) {
    const tags = ['lecture', 'instructor', 'cur_enrollment', 'max_enrollment', 'wait_list', 'ratio', 'sections'];
    const out = {};
    let n = 0;
    const tds = row.childNodes.filter((x) => x.tagName === 'td');
    for (let i = 1; i < tds.length; i += 1) {
        const txt = tds[i].structuredText.trim().split('\n');
        if (tags[n] === 'sections') {
            out[tags[n]] = makeLectures(tds.slice(i, tds.length).map((x) => x.structuredText.trim().split('\n')));
            break;
        } else {
            out[tags[n]] = [txt[0]];
        }
        n += 1;
    }
    return out;
}

function getCourses(parsed) {
    const tbody = parsed.querySelector('tbody');
    const out = [];
    for (let i = 1; i < tbody.childNodes.length; i += 2) {
        out.push(getInfo(tbody.childNodes[i]));
    }
    return out;
}

function isWaitList(parsed) {
    const tbody = parsed.querySelector('tbody');
    for (let i = 1; i < tbody.childNodes.length; i += 2) {
        if (getInfo(tbody.childNodes[i]).wait_list === '0') {
            return true;
        }
    }
    return false;
}

function fullCourse(code, term, year) {
    const promise = requestCourse(code, term, year).then((response) => {
        try {
            const body = response.data.trim();
            const parsed = parser.parse(body);
            return {
                _id: code,
                description: getDescription(parsed),
                courses: getCourses(parsed),
                full_name: getName(parsed),
            };
        } catch (e) {
            return null;
        }
    }).catch(() => null);
    return Promise.resolve(promise);
}

function waitSpace(code, term, year) {
    const promise = requestCourse(code, term, year).then((response) => {
        try {
            const body = response.data.trim();
            const parsed = parser.parse(body);
            return { space: isWaitList(parsed) };
        } catch (e) {
            return null;
        }
    }).catch(() => null);
    return Promise.resolve(promise);
}

// fullCourse('CSC148', 'winter', '2018').then((res) => console.log(res));
// waitSpace('CSC309', 'winter', '2020').then((res) => console.log(res));

module.exports = {
    queryCourse: fullCourse,
    waitListSpace: waitSpace,
};
