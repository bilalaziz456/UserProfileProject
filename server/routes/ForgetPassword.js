const express = require('express');
const router = express.Router();
const bodyPaser = require('body-parser');
const nodemailer = require('nodemailer');
const moment = require('moment');
const db = require('./connection');
let api_key = '81984eae5a03465e7ab7fabadeb757ab-6140bac2-3e5af88f';
let domain = 'sandbox82616b50a416493ca70a0ffd7b199cb2.mailgun.org';
let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure : false,
    port : 25,
    auth : {
        user : 'forPublicUse786@gmail.com',
        pass : 'forPublicUse456'
    },
    tls : {
        rejectUnauthorized : false
    }
});
let jsonParser = bodyPaser.json();
let email;
let code;
let getCode;
router.post('/verificationEmail', jsonParser,(req, res)=>{
    let rand =  Math.floor((Math.random() * 10000) + 52);
    email = req.session;
    email = req.body.email;
    db('users').select('login_id').where({'login_id' : req.body.email}).then((result)=>{
        if(result.length === 0){
            res.send({message : 'Email does not exist'})
        }else{
            let data = {
                from: 'site.com <forPublicUse786@gmail.com>',
                to: email,
                subject: 'Email Verification',
                html: 'Verification Code' + rand
            };
            mailgun.messages().send(data, function (error, body) {
                if(error){
                    console.log(error);
                }
                console.log("mailgun: ", body);
            });
            let helperOptions = {
                from : '"for Public Use" < forPublicUse786@gmail.com',
                to : email,
                subject : 'Verification Code',
                text : 'Verification Code: ' + rand
            };
            transporter.sendMail(helperOptions, (err, info)=>{
                if(err){
                    console.log(err)
                }
                else {
                    code = req.session;
                    code = rand;
                    res.send({message : "Code Send"});
                }
            })
        }
    })
});

router.post('/code', jsonParser, (req, res)=>{
    getCode = parseInt(req.body.getCode);
    if(code === getCode){
        res.send({message : "Code is correct"});

    }else{
        res.send({message: "Code is not correct"});
    }
});
router.post('/updatePassword', jsonParser, (req,res)=>{
    if(req.body.newPassword !== req.body.confirmPassword){
        res.send({message : "Password does not match"});
    }
    db("users").where({"login_id" : email }).update({"pass_word" : req.body.newPassword, 'updated_at' : moment().format()}).then(()=>{
        res.send({message : "Password is updated"});
        email =null;
    });

});

module.exports = router;