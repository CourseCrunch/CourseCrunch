/* eslint-disable object-curly-newline */
/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys, _replaceKeys } = require('./Helper');

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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Item_10': String,
    'Item_11': String,
    'Item_12': String,
    'Item_13': String,
});

INFOSchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]);
};

INFOSchema.statics.find_by_name = function (FirstName, LastName) {
    return this.find({ First_Name: FirstName, Last_Name: LastName });
};

INFOSchema.statics.aggregate_professor = function (FirstName, LastName) {
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
                Item_12: {
                    $avg: { $convert: { input: '$Item_12', to: 'double', onError: null, onNull: null } },
                },
                Item_13: {
                    $avg: { $convert: { input: '$Item_13', to: 'double', onError: null, onNull: null } },
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
    Item_7: 'Respect for Opinions and Experiences',
    Item_8: 'Consider Methods for Problem Solving',
    Item_9: 'Focus on Ethics and Social Issues',
    Item_10: 'Reflect Critically on Course Material',
    Item_11: 'Course Topics Improved Understanding',
    Item_12: 'Number Invited',
    Item_13: 'Number of Responses',
};

INFOSchema.methods.convert = function (document) {
    return replaceKeys(document, names);
};

INFOSchema.statics.convert = function (document) {
    return _replaceKeys(document, names);
};


module.exports = database.mongo.model('info_evals', INFOSchema);
