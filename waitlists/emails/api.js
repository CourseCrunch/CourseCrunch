import { createTransport } from 'nodemailer';
import { getWaitlists, removeUser } from '../resources/queries';
import { waitListSpace } from '../../timetable_api/api.js';
require('dotenv').config();
var TransporterSingleton = require("./transporter.js");

function sendEmail(user_email, course){
    // make this a singleton
    var transporter = (new TransporterSingleton()).getTransporter();

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
    var waitlist = getWaitlists();
    Object.keys(waitlist).forEach(course => {
      Object.keys(waitlist[course]).forEach(year=>{
        Object.keys(waitlist[course][year]).forEach(term=>{
          waitListSpace(course, term, year).then(result => {
            if(result.space){
              waitlist[course][year][term].forEach(userEmail=>
                {
                  if(sendEmail(userEmail, course)){
                    removeUser(userEmail, course, year, term);
                  }
                }
              );
            }});
      });});});
  }
