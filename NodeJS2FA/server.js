'use strict';


var port = process.env.PORT || 8000;
var fs = require('fs');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
var db = require('./Models/db');
var Users = require('./Models/users');
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'haciatasoy98@gmail.com',
        pass: 'mrtvawrkmswevwda'
    }
});

app.get('/', function (req, res) {
    
    //    var route = require('./Routes/LoginRoutes');
    //app.use('/Login', route);
   fs.readFile('./Views/Login.html', function (err, data) {
        res.write(data);
    });
});

app.get('/Register', function (req, res) {
    fs.readFile('./Views/Register.html', function (err, data) {
        res.write(data);
    });
});
app.get('/Home', function (req, res) {
    fs.readFile('./Views/Home.html', function (err, data) {
        res.write(data);
    });
});
app.get('/Logout', function (req, res, next) {

    res.redirect('/');
});
app.get('/TwoFa', function (req, res) {
    fs.readFile('./Views/TwoFa.html', function (err, data) {
        res.write(data);
    });
});
var code = Math.floor(100000 + Math.random() * 900000);

app.post('/Login', (req, res) => {

    var usermail = req.body.email;
    var userpassword = req.body.password;
    
    var user = Users.findOne({ email: usermail, password: userpassword }).exec()
        .then((result) => {
            if (result) {
                if (!user.twofaen) {
                    res.redirect('/Home');
                    
                }
                else {
                    
                    let mailOptions = {
                        from: 'haciatasoy98@gmail.com',
                        to: emailmodel,
                        subject: 'Doðrulama Mail',
                        text: code.toString()
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('E-posta baþarýyla gönderildi: ' + info.response);
                        }
                    });
                    res.redirect('/TwoFa');
                }

            }
            else {
                res.send('Hatalý giriþ lütfen tekrar kontrol ediniz!');
            }
             

            })
            .catch((error) => {
                res.send(error);
            });
            
          
        
    
   // console.log(req.body);
});
app.post('/TwoFa', function (req, res, next) {
    const codemodel = req.body.code;
    if (code == codemodel) {
        res.redirect('/Home');
    }
    else {
        res.send('Kod yanlýþ tekrar deneyiniz.');
    }
});
app.post('/Update', function (req, res, next) {
    var usermailup = req.body.email;
    var userpasswordup = req.body.password;

    var user = Users.findOne({ email: usermailup, password: userpasswordup })
    if (user.twofaen) {
        Users.updateOne({ twofaen: false }).exec()
            .then((result) => {
                res.send('2 Faktörlü doðrulama pasife çekildi ');
            }).
            catch((error) => {
                res.send(error);
            });
    }
    else {
        Users.updateOne({ twofaen: true }).exec()
            .then((result) => {
                res.send('2 Faktörlü doðrulama aktif edildi ');
            }).
            catch((error) => {
                res.send(error);
            });
    }
});


app.post('/Register', (req, res) => {
    var newuser = new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        twofaen:false

    });
    newuser.save()
    .then(result => {
        console.log('Baþarýyla kaydedildi');
        res.redirect('/')
    })
    .catch(err => {
        console.error(err);
        res.send('Hata oluþtu yeniden deneyiniz' + err);
    });
    console.log(newuser);
   // console.log(req.body);

   

});

app.listen(port);


