/* eslint-disable quote-props */
const database = require('../Database');


const AANDSchema = new database.Schema({
    'Code': String,
    'Dept': String,
    'Division': String,
    'Course': String,
    'Last_Name': String,
    'First_Name': String,
    'Term': String,
    'Year': String,
    'Item_1': String,
    'Item_2': String,
    'Item_3': String,
    'Item_4': String,
    'Item_5': String,
    'Item_6': String,
    'Instructor_generated_enthusiasm': String,
    'Course_Workload': String,
    'I_would_recommend_this_course': String,
    'Number_of_Students_Invited': String,
    'Number_of_Respondents': String,
    'Department': String,
});

module.exports = database.mongo.model('aands_evals', AANDSchema);
