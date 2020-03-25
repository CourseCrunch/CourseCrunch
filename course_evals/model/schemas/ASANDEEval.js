/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys } = require('./Helper');

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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Item_10': String,
    'Item_11': String,
    'Item_12': String,
    'Item_13': String,
    'Item_14': String,
    'Item_15': String,
    'Item_16': String,
    'Department': String,
});

ASANDESchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]);
};


ASANDESchema.methods.convert = function (document) {
    return replaceKeys(document, {
        Item_1: 'Intellectually stimulating',
        Item_2: 'Deeper Understanding',
        Item_3: 'Good Atmosphere',
        Item_4: 'Good Assessments',
        Item_5: 'Accurate Assessments',
        Item_6: 'Quality of Learning',
        Item_7: 'Improved Analysis and Problem-Solving Skills',
        Item_8: 'Related Course to Practical Applications/Research',
        Item_9: 'Related Course to Ethics and Environmental Issues',
        Item_10: 'Related Course to Other Courses',
        Item_11: 'Good Feedback',
        Item_12: 'Defined Learning Objectives',
        Item_13: 'Overall Rating',
        Item_14: 'Good Delivery of Course Material',
        Item_15: 'Number Invited',
        Item_16: 'Number of Responses',
    });
};

module.exports = database.mongo.model('asande_evals', ASANDESchema);
