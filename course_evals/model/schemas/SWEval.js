/* eslint-disable quote-props */
const database = require('../Database');


const SWSchema = new database.Schema({
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
    'Course_expanded_my_understanding_of_the_profession': String,
    'Course_provided_opportunity_to_consider_multiple_sources_of_information_in_my_decision-making': String,
    'Instructor_encouraged_respect_for_different_opinions_and_experiences': String,
    'Course_content_was_relevant_to_my_professional_development': String,
    'Instructors_feedback_on_assignments_projects_tests_and_or_papers_contributed_to_my_learning': String,
    'Number_Invited': String,
    'Number_of_Survey_Responses': String,
    'Department': String,
});

module.exports = database.mongo.model('sw_evals', SWSchema);
