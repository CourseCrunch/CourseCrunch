/* eslint-disable no-console */
const neo4j = require('neo4j-driver');

const uri = process.env.NEOURI;
const user = process.env.NEOUSER;
const password = process.env.NEOPWD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

/**
 * Returns a list of courses that the course with the given
 * courseCode is a prerequisite to
 * @param {*} courseCode
 */
function getPrereqTo(courseCode) {
    return new Promise((resolve, reject) => {
        try {
            const session = driver.session();
            session.run('MATCH (:Course{code: $code})-[:PrereqTo]->(c:Course) RETURN c', { code: courseCode }).then((result) => {
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
