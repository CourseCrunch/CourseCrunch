const Pool = require('pg').Pool;

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

function getWaitlists(){
    pool.query('SELECT HASH FROM CC_CREDENTIALS WHERE EMAIL = $1', [email], (error, results) => {
        if (error) {
            console.log(error);
            return callBack('error');
        }else {
            console.log(results.rows[0]);
            var pw_hash = results.rows[0].HASH;
            
            bcrypt.compare(password, pw_hash, (valid_err, hash) => {
                if (valid_err){

                    console.log(valid_err);
                    return callBack("error");

                }else if(!hash){
                    
                    return callBack("Invalid Password.");

                }else if(hash){

                    return callBack("Valid Password.");

                }
            });
        }
    });

}