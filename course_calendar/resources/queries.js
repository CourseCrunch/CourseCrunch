/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const neo4j = require('neo4j-driver');

process.env.NEOUSER = 'neo4j';
process.env.NEOPWD = 'So4pUsBarmHorse';
process.env.NEOURI = 'bolt://localhost:7687';
const uri = process.env.NEOURI;
const user = process.env.NEOUSER;
const password = process.env.NEOPWD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

/**
 * Returns a list of courses that the course with the given
 * courseCode is a prerequisite to
 * @param {*} courseCode
 */
function getPrereqTo(courses) {
    return new Promise((resolve, reject) => {
        try {
            const session = driver.session();
            const query = 'WITH $courses as prereqs '
            + 'MATCH (c1:Course) - [:PrereqTo] -> (c2:Course) '
            + 'USING INDEX c1:Course(code) '
            + 'where c1.code in prereqs '
            + 'with prereqs, collect(c2) as checkingCourses '
            + 'unwind checkingCourses as potentialCourses '
            + 'OPTIONAL MATCH (c3:Course) - [:PrereqTo] -> (potentialCourses) '
            + 'with prereqs, potentialCourses, collect(c3) as checkingPrereqs '
            + 'where not potentialCourses.code in prereqs and all(c in checkingPrereqs where c.code in prereqs) '
            + 'return potentialCourses '
            + 'UNION '
            + 'MATCH (c1:Course) '
            + 'where not (:Course) - [:PrereqTo] -> (c1) '
            + 'return c1 as potentialCourses;';
            session.run(query, { courses }).then((result) => {
                const responseLst = [];
                result.records.forEach((record) => {
                    const node = record.get(0);
                    responseLst.push(node.properties.code);
                });
                session.close();
                resolve(responseLst);
            }).catch((e) => { console.log(e); });
        } catch (e) {
            reject(e);
        }
    });
}

function getPrerequisites(courseCode) {
    return new Promise((resolve, reject) => {
        try {
            const session = driver.session();
            session.run('MATCH (:Course{code: $code})<-[:PrereqTo]-(c:Course) RETURN c', { code: courseCode }).then((result) => {
                const responseLst = [];
                result.records.forEach((record) => {
                    const node = record.get(0);
                    responseLst.push(node.properties.code);
                });
                session.close();
                resolve(responseLst);
            }).catch((e) => { console.log(e); });
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {
    getPrereqTo,
    getPrerequisites,
};
