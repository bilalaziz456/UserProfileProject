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

router.get('/skillsApproval', jsonParser, (req, res) => {
    let skillApproval = [];
    db('skills').select('skills.skill_name', 'users.login_id').innerJoin('users', 'skills.user_uuid', 'users.user_uuid').where({'status': 0}).then((result) => {
        for (let i = 0; i < result.length; i++) {
            skillApproval.push({skill: result[i].skill_name, email: result[i].login_id});
        }
        res.send(skillApproval);
    })
});

router.post('/skillApproved', jsonParser, (req, res) => {
    let skillApproval = [];
    db('skills').update({
        'status': 1,
        'updated_at': moment().format()
    }).where({'skill_name': req.body.approvedSkill}).then(() => {
        db('skills').select('skills.skill_name', 'users.login_id').innerJoin('users', 'skills.user_uuid', 'users.user_uuid').where({'status': 0}).then((result) => {
            for (let i = 0; i < result.length; i++) {
                skillApproval.push({skill: result[i].skill_name, email: result[i].login_id});
            }
            res.send(skillApproval);
        })
    })
});

router.post('/editSkillApproved', jsonParser, (req, res) => {
    let userUuid;
    db('users').select('user_uuid').where({'login_id': req.body.email}).then((result) => {
        userUuid = result[0].user_uuid;
        db('skills').update({
            'skill_name': req.body.afterEditSkill,
            'status': 1,
            'updated_at': moment().format()
        }).where({'skill_name': req.body.beforeSkillEdit, 'user_uuid': userUuid}).then(() => {
            res.send({message: 'Successful'})
        })
    })
});
router.post('/rejectSkill', jsonParser, (req, res) => {
    let userUuid;
    db('users').select('user_uuid').where({'login_id': req.body.email}).then((result) => {
        userUuid = result[0].user_uuid;
        db('skills').update({'status': 2, 'updated_at': moment().format()}).where({
            'skill_name': req.body.skillName,
            'user_uuid': userUuid
        }).then(() => {
            db('approval_rejection_reasons')
                .insert({
                    'approval_rejection_reason': req.body.rejectSkill,
                    'email': req.body.email,
                    'approval_rejection_reason_status': 0,
                    'created_at': moment().format(),
                    'updated_at': moment().format()
                }).then(() => {
                res.send({message: 'Sucessful'})
            })
        })
    })
});
router.get('/categoryApproval', jsonParser, (req, res) => {
    let categoryApproval = [];
    db('category').select('category.category_name', 'users.login_id').innerJoin('users', 'category.user_uuid', 'users.user_uuid').where({'status': 0}).then((result) => {
        for (let i = 0; i < result.length; i++) {
            categoryApproval.push({category: result[i].category_name, email: result[i].login_id});
        }
        res.send(categoryApproval);
    })
});

router.post('/categoryApproved', jsonParser, (req, res) => {
    let categoryApproved = [];
    db('category').update({
        'status': 1,
        'updated_at': moment().format()
    }).where({'category_name': req.body.approvedCategory}).then(() => {
        db('category').select('category.category_name', 'users.login_id').innerJoin('users', 'category.user_uuid', 'users.user_uuid').where({'status': 0}).then((result) => {
            for (let i = 0; i < result.length; i++) {
                categoryApproved.push({category: result[i].category_name, email: result[i].login_id});
            }
            res.send(categoryApproved);
        })
    })
});
router.post('/editCategoryApproved', jsonParser, (req, res) => {
    let userUuid;
    db('users').select('user_uuid').where({'login_id': req.body.email}).then((result) => {
        userUuid = result[0].user_uuid;
        db('category').update({
            'category_name': req.body.afterEditCategory,
            'status': 1,
            'updated_at': moment().format()
        }).where({'category_name': req.body.beforeEditCategory, 'user_uuid': userUuid}).then(() => {
            res.send({message: 'Successful'})
        })
    })
});

router.post('/rejectCategory', jsonParser, (req, res) => {
    let userUuid;
    db('users').select('user_uuid').where({'login_id': req.body.email}).then((result) => {
        userUuid = result[0].user_uuid;
        db('category').update({
            'status': 2,
            'updated_at': moment().format()
        }).where({'category_name': req.body.categoryName, 'user_uuid': userUuid}).then(() => {
            db('approval_rejection_reasons')
                .insert({
                    'approval_rejection_reason': req.body.rejectCategory,
                    'email': req.body.email,
                    'approval_rejection_reason_status': 0,
                    'created_at': moment().format(),
                    'updated_at': moment().format()
                }).then(() => {
                res.send({message: 'Sucessful'})
            })
        })
    })
});
router.get('/imageApproval', jsonParser, (req, res) => {
    let imageApproval = [];
    db('image_status').select('image_path', 'email').where({'image_status ': 0}).then((result) => {
        for (let i = 0; i < result.length; i++) {
            imageApproval.push({imagePath: result[i].image_path, email: result[i].email});
        }
        res.send(imageApproval);
    })
});
router.post('/imageApproved', jsonParser, (req, res) => {
    let imageApproved = [];
    db('image_status').update({'image_status': 1, 'updated_at': moment().format()}).where({
        'email': req.body.email,
        'image_path': req.body.imagePath
    }).then(() => {
        db('image_status').select('image_path').where({
            'email': req.body.email,
            'image_status': 1
        }).orderBy('created_at', 'desc').then((result) => {
            db('profile').update({'image_path': result[0].image_path}).where({'primary_email': req.body.email}).then(() => {
                db('image_status').select('image_path', 'email').where({'image_status': 0}).then((result) => {
                    for (let i = 0; i < result.length; i++) {
                        imageApproved.push({imagePath: result[i].image_path, email: result[i].primary_email});
                    }
                    res.send(imageApproved);
                })
            })
        });

    })
});
router.post('/rejectImage', jsonParser, (req, res) => {

    db('image_status').update({'image_status': 2, 'updated_at': moment().format()}).where({
        'email': req.body.email,
        'image_path': req.body.imagePath
    }).then(() => {
        db('approval_rejection_reasons')
            .insert({
                'approval_rejection_reason': req.body.rejectImage,
                'email': req.body.email,
                'approval_rejection_reason_status': 0,
                'created_at': moment().format(),
                'updated_at': moment().format()
            }).then(() => {
            res.send({message: 'Sucessful'})
        })
    });
    let data = {
        from: 'site.com <forPublicUse786@gmail.com>',
        to: req.body.email,
        subject: 'Rejection Reason',
        html: 'Hello,<br>' + req.body.rejectImage
    };
    mailgun.messages().send(data, function (error, body) {
        if(error){
            console.log(error);
        }
        console.log("mailgun: ", body);
    });
    let mailOptions={
        from : '"for Public Use" <forPublicUse786@gmail.com',
        to : req.body.email,
        subject : "Rejection Reason",
        html : 'Hello,<br>' + req.body.rejectImage
    };
    transporter.sendMail(mailOptions, function(error){
        if(error){
            res.end("error");
        }else{
            res.end("sent");
        }
    });

});
module.exports = router;