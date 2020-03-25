/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys, _replaceKeys } = require('./Helper');

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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Item_10': String,
    'Item_11': String,
    'Item_12': String,
    'Item_13': String,
    'Department': String,
});

SWSchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]);
};

SWSchema.statics.find_by_name = function (FirstName, LastName) {
    return this.find({ First_Name: FirstName, Last_Name: LastName });
};

const names = {
    Item_1: 'Intellectually stimulating',
    Item_2: 'Deeper Understanding',
    Item_3: 'Good Atmosphere',
    Item_4: 'Good Assessments',
    Item_5: 'Accurate Assessments',
    Item_6: 'Quality of Learning',
    Item_7: 'Expanded Understanding of Profession',
    Item_8: 'Consider Sources for Decision-Making',
    Item_9: 'Respect for Opinions and Experiences',
    Item_10: 'Content Relevent to Professional Development',
    Item_11: 'Good Marking',
    Item_12: 'Number Invited',
    Item_13: 'Number of Responses',
};

SWSchema.methods.convert = function (document) {
    return replaceKeys(document, names);
};

SWSchema.statics.convert = function (document) {
    return _replaceKeys(document, names);
};


module.exports = database.mongo.model('sw_evals', SWSchema);
