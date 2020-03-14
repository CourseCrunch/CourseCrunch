const mongo = require('mongoose');

const { Schema } = mongo;

mongo.set('useCreateIndex', true);


mongo.connect(process.env.CONNECTSTR, { useNewUrlParser: true, useUnifiedTopology: true });

const InstructorSchema = new Schema({
    pk_id: String,
    teacherfirstname_t: String,
    teacherlastname_t: String,
    teacherdepartment_s: String,
    fullname: String,
    school: String,
});

InstructorSchema.path('pk_id').index({ unique: true });

module.exports = {
    db: mongo,
    Instruct: mongo.model('Instructors', InstructorSchema),
};
