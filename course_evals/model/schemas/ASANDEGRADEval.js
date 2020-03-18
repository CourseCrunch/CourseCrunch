/* eslint-disable quote-props */
const database = require('../Database');


const ASANDEGRADSchema = new database.Schema({
    'Code': String,
    'Dept': String,
    'Division': String,
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
    'Overall_rating_of_instructor_teaching': String,
    'Number_Invited': String,
    'Number_of_Survey_Responses': String,
    'Department': String,
});

module.exports = database.mongo.model('asande_grad_evals', ASANDEGRADSchema);
