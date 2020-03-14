const dbReq = require('../resources/queries').default;
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log(`Email sent: ${info.response}`);
        return true;
    });
}

function checkUserWaitlist(waitlist, course, term, year, user) {
    timetableApi.waitListSpace(course, term, year).then((result) => {
        if (result && result.space) {
            waitlist[course][year][term].forEach((userID) => {
                dbReq.getUserEmail(userID).then((userEmail) => {
                    if (sendEmail(userEmail, course)) {
                        dbReq.removeUser(userEmail, course, year, term).then(() => { console.log('User removed from waitlist'); }).catch((e) => {
                            // eslint-disable-next-line no-console
                            console.log(e);
                        });
                    }
                // eslint-disable-next-line no-console
                }).catch((e) => console.log(e)); // }
            });
        }
    // eslint-disable-next-line no-console
    }).catch((e) => { console.log(e); });
}

function checkWaitlists() {
    // check each course in CC_USER_WAITLIST
    // {"CSC209": {"2020": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
    dbReq.getWaitlists().then((waitlist) => {
        Object.keys(waitlist).forEach((course) => {
            Object.keys(waitlist[course]).forEach((year) => {
                Object.keys(waitlist[course][year]).forEach((term) => {
                    checkUserWaitlist(waitlist, course, term, year, user);
                });
            });
        });
    // eslint-disable-next-line no-console
    }).catch((e) => { console.log(e); });
}

checkWaitlists();
