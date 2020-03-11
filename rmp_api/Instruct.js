const mongo = require('mongoose');
const mongooseFuzzySearching = require('mongoose-fuzzy-searching');

const { Schema } = mongo;

mongo.set('useCreateIndex', true);


mongo.connect(process.env.CONNECTSTR, { useNewUrlParser: true, useUnifiedTopology: true });

const InstructorSchema = new Schema({
    pk_id: String,
    teacherfirstname_t: String,
    teacherlastname_t: String,
    teacherdepartment_s: String,
    fullname: String,
});

InstructorSchema.plugin(mongooseFuzzySearching, {
    fields: [{
        name: 'fullname',
        minSize: 5,
    },
    ],
});


InstructorSchema.path('pk_id').index({ unique: true });

module.exports = {
    db: mongo,
    Instruct: mongo.model('Instructors', InstructorSchema),
};
