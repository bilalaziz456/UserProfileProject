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
let host,link;

router.get('/verifyEmail',function(req,res){
    if((req.protocol+"://"+req.get('host'))===("http://"+host))
    {
        db('users').update({'login_id_status' : 1}).where({'login_id': req.query.id,}).then(()=>{
            res.redirect('http://localhost:8080/');
        });
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});


router.post('/register', jsonParser, (req, res) => {
    let country_uuid;
    let city_uuid;
    let primary_country_code_uuid;
    let secondary_number_country_code_uuid;
    if(req.body.password !== req.body.confirmPassword){
        res.send({message: 'Password does not match'});
    }else {
        db('users').select('login_id').where({'login_id': req.body.primaryEmail}).then((result) => {
            if (result === "" || result.length === 0) {
                host=req.get('host');
                link="http://"+req.get('host')+"/verifyEmail?id="+req.body.primaryEmail;
                let data = {
                    from: 'site.com <forPublicUse786@gmail.com>',
                    to: req.body.primaryEmail,
                    subject: 'Email Verification',
                    html: 'Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"'
                };
                mailgun.messages().send(data, function (error, body) {
                    if(error){
                        console.log(error);
                    }
                    console.log("mailgun: ", body);
                });
                let mailOptions={
                    from : '"for Public Use" <forPublicUse786@gmail.com',
                    to : req.body.primaryEmail,
                    subject : "Please confirm your Email account",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                };
                transporter.sendMail(mailOptions, function(error){
                    if(error){
                        res.end("error");
                    }else{
                        res.end("sent");
                    }
                });
                db('country').select('country_uuid').where({'country': req.body.country}).then((result) => {
                    country_uuid = result[0].country_uuid;
                    db('city').select('city_uuid').where({'city': req.body.city}).then((result) => {
                        city_uuid = result[0].city_uuid;
                        db('country_code').select('country_code_uuid').where({'country_code' : req.body.countryCodePrimaryNumber}).then((result)=>{
                            primary_country_code_uuid = result[0].country_code_uuid;
                            if(req.body.secondaryNumber === ""){
                                db('profile')
                                    .insert({
                                        'image_path' : 'uploads\\nopic.png',
                                        'first_name': req.body.firstName,
                                        'last_name': req.body.lastName,
                                        'country_uuid': country_uuid,
                                        'city_uuid': city_uuid,
                                        'primary_email': req.body.primaryEmail,
                                        'secondary_email': req.body.secoundaryEmail,
                                        'primary_number': req.body.primaryNumber,
                                        'primary_number_country_code_uuid' : primary_country_code_uuid,
                                        'secondary_number_country_code_uuid' : secondary_number_country_code_uuid,
                                        'secondary_number': req.body.secondaryNumber,
                                        'created_at': moment().format(),
                                        'updated_at': moment().format()

                                    }).then(() => {
                                    db('users')
                                        .insert({
                                            'login_id': req.body.primaryEmail,
                                            'pass_word': req.body.password,
                                            'created_at': moment().format(),
                                            'updated_at': moment().format(),
                                            'roles' : 0,
                                            'login_id_status' : 0
                                        }).then(()=>{
                                        res.send({message: "User successfully registered"})
                                    })
                                })
                            }else {
                                db('country_code').select('country_code_uuid').where({'country_code' : req.body.countryCodeSecondaryNumber}).then((result)=>{
                                    secondary_number_country_code_uuid = result[0].country_code_uuid;
                                    db('profile')
                                        .insert({
                                            'image_path' : 'uploads\\nopic.png',
                                            'first_name': req.body.firstName,
                                            'last_name': req.body.lastName,
                                            'country_uuid': country_uuid,
                                            'city_uuid': city_uuid,
                                            'primary_email': req.body.primaryEmail,
                                            'secondary_email': req.body.secoundaryEmail,
                                            'primary_number': req.body.primaryNumber,
                                            'primary_number_country_code_uuid' : primary_country_code_uuid,
                                            'secondary_number_country_code_uuid' : secondary_number_country_code_uuid,
                                            'secondary_number': req.body.secondaryNumber,
                                            'created_at': moment().format(),
                                            'updated_at': moment().format()

                                        }).then(() => {
                                        db('users')
                                            .insert({
                                                'login_id': req.body.primaryEmail,
                                                'pass_word': req.body.password,
                                                'created_at': moment().format(),
                                                'updated_at': moment().format(),
                                                'roles' : 0,
                                                'login_id_status' : 0
                                            }).then(()=>{
                                            res.send({message: "User successfully registered"})
                                        })
                                    })
                                });
                            }
                        })
                    })
                })
            }else {
                res.send({message : 'Email Already Exist'})
            }
        });
    }
});


router.get('/country', jsonParser, (req, res) => {
    let country = [];
    db('country').select('country').then((result) => {
        for (let i = 0; i < result.length; i++) {
            country.push({value: result[i].country, label: result[i].country});
        }
        res.send(country);
    })
});

router.post('/city', jsonParser, (req, res) => {
    let city = [];
    let country_uuid;
    db('country').select('country_uuid').where({'country': req.body.country}).then((result) => {
        if (result === "" || result.length === 0) {
        } else {
            country_uuid = result[0].country_uuid;
            db('city').select('city').where({'country_uuid': country_uuid}).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    city.push({value: result[i].city, label: result[i].city});
                }
                res.send(city);
            })
        }
    });
});

module.exports = router;