var dbReq = require('../resources/queries');
var timetable_api = require('../../timetable_api/api.js');
require('dotenv').config();
var TransporterSingleton = require("./transporter.js");
var mailer = require('nodemailer');

function sendEmail(user_email, course){
    // make this a singleton
    var transporter = TransporterSingleton;
    console.log(transporter);
    var mailOptions = {
      from: process.env.EMAILUSER,
      to: user_email,
      subject: 'Waitlist Availability',
      text: "Good news! We just found out that there isn't a waitlist anymore for " + course + "."
    };
      
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log('Email sent: ' + info.response);
        return true;
      }
    });
}


function checkWaitlists(){
  // check each course in CC_USER_WAITLIST
  // {"CSC209": {"2020": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
  var waitlist = dbReq.getWaitlists();
  Object.keys(waitlist).forEach(course => {
    Object.keys(waitlist[course]).forEach(year=>{
      Object.keys(waitlist[course][year]).forEach(term=>{
        timetable_api.waitListSpace(course, term, year).then(result => {
          console.log("here");
          if(result.space){
            waitlist[course][year][term].forEach(userEmail=>
              {
                if(sendEmail(userEmail, course)){
                  dbReq.removeUser(userEmail, course, year, term);
                  console.log("User removed from waitlist");
                }
              }
            );
          }}).catch(e => {console.log(e)});
    });});});
}


checkWaitlists();