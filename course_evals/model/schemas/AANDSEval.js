/* eslint-disable object-curly-newline */
/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys, _replaceKeys } = require('./Helper');

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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Item_10': String,
    'Item_11': String,
    'Department': String,
});

AANDSchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]).exec();
};

AANDSchema.statics.find_by_name = function (FirstName, LastName) {
    return this.find({ First_Name: FirstName, Last_Name: LastName });
};

AANDSchema.statics.prof_scores = function (FirstName, LastName) {
    return this.aggregate([
        { $match: { First_Name: FirstName, Last_Name: LastName } },
        {
            $group: {
                _id: null,
                Item_1: {
                    $avg: { $convert: { input: '$Item_1', to: 'double', onError: null, onNull: null } },
                },
                Item_2: {
                    $avg: { $convert: { input: '$Item_2', to: 'double', onError: null, onNull: null } },
                },
                Item_3: {
                    $avg: { $convert: { input: '$Item_3', to: 'double', onError: null, onNull: null } },
                },
                Item_4: {
                    $avg: { $convert: { input: '$Item_4', to: 'double', onError: null, onNull: null } },
                },
                Item_5: {
                    $avg: { $convert: { input: '$Item_5', to: 'double', onError: null, onNull: null } },
                },
                Item_6: {
                    $avg: { $convert: { input: '$Item_6', to: 'double', onError: null, onNull: null } },
                },
                Item_7: {
                    $avg: { $convert: { input: '$Item_7', to: 'double', onError: null, onNull: null } },
                },
                Item_8: {
                    $avg: { $convert: { input: '$Item_8', to: 'double', onError: null, onNull: null } },
                },
                Item_9: {
                    $avg: { $convert: { input: '$Item_9', to: 'double', onError: null, onNull: null } },
                },
                Item_10: {
                    $avg: { $convert: { input: '$Item_10', to: 'double', onError: null, onNull: null } },
                },
                Item_11: {
                    $avg: { $convert: { input: '$Item_11', to: 'double', onError: null, onNull: null } },
                },
            },
        },
        { $project: {
            _id: 0,
        } },
    ]);
};

const names = {
    Item_1: 'Intellectually stimulating',
    Item_2: 'Deeper Understanding',
    Item_3: 'Good Atmosphere',
    Item_4: 'Good Assessments',
    Item_5: 'Accurate Assessments',
    Item_6: 'Quality of Learning',
    Item_7: 'Generated Enthusiasm',
    Item_8: 'Course Workload',
    Item_9: 'Would Reccomend',
    Item_10: 'Number Invited',
    Item_11: 'Number of Responses',
};

AANDSchema.methods.convert = function () {
    return replaceKeys(this, names);
};

AANDSchema.statics.convert = function (document) {
    return _replaceKeys(document, names);
};

AANDSchema.statics.codes = function () {
    return this.aggregate([{ $group: { _id: '$Code' } }]).exec();
};

AANDSchema.statics.category_code_average = function (courseId, category) {
    return this.aggregate([
        { $match: { Code: courseId } },
        { $group: { _id: '$Code', recommendation: { $avg: { $toDecimal: category } } } },
    ]);
};

module.exports = database.mongo.model('aands_evals', AANDSchema);
