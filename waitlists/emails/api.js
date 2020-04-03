const dbReq = require('../resources/queries');
const timetableApi = require('../../timetable_api/api.js');
require('dotenv').config();
const TransporterSingleton = require('./transporter.js');


function sendEmail(userEmail, course) {
    // make this a singleton
    const transporter = TransporterSingleton;
    const mailOptions = {
        from: process.env.EMAILUSER,
        to: userEmail,
        subject: 'Waitlist Availability',
        text: `Good news! We just found out that there isn't a waitlist anymore for ${course}.`,
    };

    return transporter.sendMail(mailOptions).then(() => true).catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
        return false;
    });
}

function checkUserWaitlist(waitlist, course, term, year) {
    timetableApi.waitListSpace(course, term, year).then((result) => {
        // TODO: REMOVE THE CSC209H5 CONDITION THIS IS JUST FOR TESTING
        if ((result && result.space) || course === 'CSC209H5') {
            waitlist[course][year][term].forEach((userID) => {
                dbReq.getUserEmail(userID).then((userEmail) => {
                    sendEmail(userEmail, course).then((sent) => {
                        console.log(`sending an email to ${userEmail}`);
                        if (sent) {
                            dbReq.removeUser(userID, course, year, term).then(() => { console.log('User removed from waitlist'); }).catch((e) => {
                                // eslint-disable-next-line no-console
                                console.log(e);
                            });
                        }
                    }).catch((e) => console.log(e)); // }
                });
            });
        }
    });
}

function checkWaitlists() {
    // check each course in CC_USER_WAITLIST
    // {"CSC209": {"2020": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
    dbReq.getWaitlists().then((waitlist) => {
        Object.keys(waitlist).forEach((course) => {
            Object.keys(waitlist[course]).forEach((year) => {
                Object.keys(waitlist[course][year]).forEach((term) => {
                    checkUserWaitlist(waitlist, course, term, year);
                });
            });
        });
    // eslint-disable-next-line no-console
    }).catch((e) => { console.log(e); });
}

module.exports = {
    checkWaitlists,
    checkUserWaitlist,
    sendEmail,
};
