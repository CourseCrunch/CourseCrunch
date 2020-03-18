const database = require('../Database');


const UTMSchema = new database.Schema({
    Code: String,
    Dept: String,
    Course: String,
    Last_Name: String,
    First_Name: String,
    Term: String,
    Year: String,
    Item_1: String,
    Item_2: String,
    Item_3: String,
    Item_4: String,
    Item_5: String,
    Item_6: String,
    Course_Workload: String,
    I_would_recommend_this_course: String,
    I_attended_class: String,
    Inspired_to_learn_subject_matter: String,
    Number_Invited: String,
    Number_of_Survey_Responses: String,
    Department: String,
});

module.exports = database.mongo.model('utm_evals', UTMSchema);
