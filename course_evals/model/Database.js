const mongo = require('mongoose');

const { Schema } = mongo;

mongo.set('useCreateIndex', true);

mongo.connect(process.env.MONGOEVALSTR, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    Schema,
    mongo,
};
