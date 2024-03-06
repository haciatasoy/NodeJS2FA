var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

var mongoDB = 'mongodb://localhost/NodeJS2FA';

mongoose.connect('mongodb://localhost:27017/NodeJS2FA')
    .then(() => {
        console.log('Veritabanýna baþarýyla baðlandý');
    })
    .catch((err) => {
        console.error(err);
    });

