/* eslint-disable quote-props */
const database = require('../Database');


const ASANDESchema = new database.Schema({
    'Code': String,
    'Course_-_Department': String,
    'Course_-_Division': String,
    'Course_-_Course_Name': String,
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
    'APSC01': String,
    'APSC02': String,
    'APSC03': String,
    'APSC04': String,
    'APSC05': String,
    'APSC06': String,
    'APSC07': String,
    'LEC01': String,
    'InvitedCount': String,
    'RespondentCount': String,
    'Department': String,
});

module.exports = database.mongo.model('asande_evals', ASANDESchema);
