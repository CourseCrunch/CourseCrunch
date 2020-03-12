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
                var year = result.CCYear;
                var userID = result.ID;
                var term = result.Term;
                // waitlists will look like: 
                // {"CSC209": {"Furkan Alaca": {"W": ["naaz.sibia@utoronto.ca", ...]}}}
                if(!waitlists.hasOwnProperty(course))
                    waitlist[course] = new Object();

                if(!waitlists[course].hasOwnProperty(year)){
                    waitlist[course][year] = new Object();
                }

                if(!waitlists[course][year].hasOwnProperty(term)){
                    waitlist[course][year][term] = [];
                }
                var email = getUserEmail(userID);
                if(email) waitlist[course][year][term].push(email);
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

function getUserIDFromMail(email){
    pool.query('SELECT ID FROM CC_CREDENTIALS WHERE EMAIL=$1', [email], (error, results) => {
        if (error) {
            console.log(error);
            return callBack('error');
        }else {
            if(length(results) == 0){
                return null;
            }
            return results[0].ID;
        }
    });
}

function removeUser(email, courseCode, year, term){
    var id = getUserIDFromMail(email);
    pool.query('DELETE FROM CC_USER_WAITLIST WHERE ID = $1 AND courseCode = $2 AND year=$3 AND term=$4', [id, courseCode, year, term], (error, results) => {
    if (error) {
            console.log(error);
            return callBack('error');
        }
    });
}

function addUser(uuid, courseCode, year, term){
    pool.query('INSERT INTO CC_USER_WAITLIST(ID, CourseCode, CCYear, Term) VALUES ($1, $2, $3, $4)', [id, courseCode, year, term], (error, results) => {
        if (error) {
                console.log(error);
                return callBack('error');
            }
    });
}
    