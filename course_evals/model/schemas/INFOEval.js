/* eslint-disable quote-props */
const database = require('../Database');

const INFOSchema = new database.Schema({
    'Code': String,
    'Department': String,
    'Course_Name': String,
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
    'Instructor_encouraged_students_to_think_about_the_subject_matter_from_multiple_perspectives': String,
    'Instructor_encouraged_exploration_of_alternative_approaches_when_problem-solving': String,
    'Course_drew_attention_to_ethical_and_social_issues_related_to_field_of_study': String,
    'Instructor_encouraged_students_to_reflect_critically_on_the_course_material': String,
    'Instructor_explained_how_course_topics_contributed_to_an_overall_understanding_of_the_field': String,
    'Number_Invited': String,
    'Number_of_Survey_Responses': String,
});

module.exports = database.mongo.model('info_evals', INFOSchema);
