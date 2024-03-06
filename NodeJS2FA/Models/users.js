var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usersSchema = new Schema({
    username:  { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    twofaen: Boolean
});

var usersdb = mongoose.model('Users', usersSchema);

module.exports = usersdb;

