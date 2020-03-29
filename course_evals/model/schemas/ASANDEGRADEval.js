/* eslint-disable object-curly-newline */
/* eslint-disable func-names */
/* eslint-disable quote-props */
const database = require('../Database');
const { replaceKeys, _replaceKeys } = require('./Helper');

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
    'Item_7': String,
    'Item_8': String,
    'Item_9': String,
    'Department': String,
});

ASANDEGRADSchema.statics.find_names = function () {
    return this.aggregate([
        { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
        {
            $project: {
                _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
            },
        },
    ]).exec();
};

ASANDEGRADSchema.statics.find_by_name = function (FirstName, LastName) {
    return this.find({ First_Name: FirstName, Last_Name: LastName });
};

ASANDEGRADSchema.statics.prof_scores = function (FirstName, LastName) {
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
    Item_7: 'Overall Rating',
    Item_8: 'Number Invited',
    Item_9: 'Number of Responses',
};

ASANDEGRADSchema.methods.convert = function () {
    return replaceKeys(this, names);
};

ASANDEGRADSchema.statics.convert = function (document) {
    return _replaceKeys(document, names);
};

ASANDEGRADSchema.statics.codes = function () {
    return this.aggregate([{ $group: { _id: '$Code' } }]).exec();
};

ASANDEGRADSchema.statics.category_code_average = function (courseId, category) {
    return this.aggregate([
        { $match: { Code: courseId } },
        { $group: { _id: '$Code', recommendation: { $avg: { $toDecimal: category } } } },
    ]);
};

ASANDEGRADSchema.statics.getReccomendations = function (courses, filteredCourse, limit) {
    return this.aggregate([
        { $group: { _id: '$Code', Course_Workload: { $avg: { $toDecimal: '$Item_7' } }, Term: { $addToSet: { $concat: ['$Term', '$Year'] } } } },
        { $match: { $and: [{ _id: { $nin: filteredCourse } }, { Term: { $in: ['Winter2019'] } }, { _id: { $in: courses } }] } },
        { $sort: { Course_Workload: 1 } },
        { $limit: limit },
    ]).exec();
};

ASANDEGRADSchema.statics.get_professors = function () {
    return this.aggregate([
        { $group:
            {
                _id: { FirstName: '$First_Name', LastName: '$Last_Name' },
            },
        }, { $project:
            {
                _id: 0, title: { $concat: ['$_id.FirstName', ' ', '$_id.LastName'] }, school: 'grad',
            },
        },
    ]).exec();
};

ASANDEGRADSchema.statics.schema_name = function () {
    return 'Engineering (Graduate)';
};

module.exports = database.mongo.model('asande_grad_evals', ASANDEGRADSchema);
