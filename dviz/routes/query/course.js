require('dotenv').config('../../.env')
const mongo = require('mongoose');

const { Schema } = mongo;

//mongo.set('useCreateIndex', true);
mongo.connect(process.env.CONNECTSTR, { useNewUrlParser: true, useUnifiedTopology: true });

const CourseSchema = new Schema({
    Code: String
});

const faculties = ['aands', 'asande', 'asande_grad', 'info', 'sw', 'utm', 'utsc'];
faculties.forEach((faculty) => {
    const collectionName = `${faculty}_evals`;
    mongo.model(collectionName, CourseSchema);
});

module.exports = mongo