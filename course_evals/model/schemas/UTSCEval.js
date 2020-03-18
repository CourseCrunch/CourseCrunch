/* eslint-disable quote-props */
const database = require('../Database');


const UTSCSchema = new database.Schema({
    'Code': String,
    'Dept': String,
    'Course': String,
    'Term': String,
    'Year': String,
    'Last_Name': String,
    'First_Name': String,
    'Item_1': String,
    'Item_2': String,
    'Item_3': String,
    'Item_4': String,
    'Item_5': String,
    'Item_6': String,
    'Inspired_thinking_about_subject_matter': String,
    'Course_Workload': String,
    'I_would_recommend_this_course': String,
    'Number_Invited': String,
    'Number_of_Survey_Responses': String,
    'Department': String,
});

module.exports = database.mongo.model('utsc_evals', UTSCSchema);
