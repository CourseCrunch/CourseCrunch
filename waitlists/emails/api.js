import { createTransport } from 'nodemailer';
import { getWaitlists, removeUser } from '../resources/queries';
import { waitListSpace } from '../../timetable_api/api.js';
require('dotenv').config();

function sendEmail(user_email, course){
    var transporter = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAILUSER,
          pass: process.env.EMAILPWD
        }
      });
      
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
    // {"CSC209": {"Furkan Alaca": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
    var waitlist = getWaitlists();
    for(course in Object.keys(waitlist)){
      for(year in Object.keys(waitlist[course])){
        for(term in Object.keys(waitlist[course][year])){
          var result = waitListSpace(course, term, year);
          if(result && result.space){
            waitlist[course][year][term].forEach(userEmail=>
              {
                if(sendEmail(userEmail, course)){
                  removeUser(userEmail, course, year, term);
                }
              }
            );
          }
        }
      }
    }
}