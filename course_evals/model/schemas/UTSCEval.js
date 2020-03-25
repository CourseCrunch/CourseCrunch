/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys } = require('./Helper');


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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Item_10': String,
    'Item_11': String,
    'Department': String,
});

UTSCSchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]);
};

UTSCSchema.methods.convert = function (document) {
    return replaceKeys(document, {
        Item_1: 'Intellectually stimulating',
        Item_2: 'Deeper Understanding',
        Item_3: 'Good Atmosphere',
        Item_4: 'Good Assessments',
        Item_5: 'Accurate Assessments',
        Item_6: 'Quality of Learning',
        Item_7: 'Inspired to Learn',
        Item_8: 'Course Workload',
        Item_9: 'Would Reccomend',
        Item_10: 'Number Invited',
        Item_11: 'Number of Responses',
    });
};

module.exports = database.mongo.model('utsc_evals', UTSCSchema);
