const Pool = require('pg').Pool;

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

function getWaitlists(){
    var waitlists = new Object(); 
    pool.query('SELECT * FROM CC_USER_WAITLIST', [], (error, results) => {
        if (error) {
            console.log(error);
            return callBack('error');
        }else {
            console.log(results);
            results.forEach(result => {
                var course = result.CourseCode;
                var instructor = result.Instructor;
                var userID = result.ID;
                var term = result.Term;
                // waitlists will look like: 
                // {"CSC209": {"Furkan Alaca": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
                if(!waitlists.hasOwnProperty(course))
                    waitlist[course] = new Object();

                if(!waitlists[course].hasOwnProperty(instructor)){
                    waitlist[course][instructor] = new Object();
                }

                if(!waitlists[course][instructor].hasOwnProperty(term)){
                    waitlist[course][instructor][term] = [];
                }
                var email = getUserEmail(userID);
                if(email) waitlist[course][instructor][term].push(email);
            });
        }
    });
}

function getUserEmail(userID){
    pool.query('SELECT EMAIL FROM CC_CREDENTIALS WHERE ID=$1', [userID], (error, results) => {
        if (error) {
            console.log(error);
            return callBack('error');
        }else {
            if(length(results) == 0){
                return null;
            }
            return results[0].email;
        }
    });
}