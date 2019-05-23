const express = require('express');
const router = express.Router();
const bodyPaser = require('body-parser');
const multer = require('multer');
const moment = require('moment');
const db = require('./connection');
let email;
let userUuid;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        let dateTime = new Date();
        let date = dateTime.toISOString().replace('Z', '-').replace('T', '-').replace(':', '-').replace(':', '-').replace(/\.\d+/, "");

        let fileName = date + userUuid + ext;
        cb(null, fileName);
    }
});
const upload = multer({
    storage: storage
});

let jsonParser = bodyPaser.json();

router.post('/login', jsonParser, function (req, res) {
    email = req.session;
    email = req.body.email;
    userUuid = req.session;
    db('users').select('login_id', 'user_uuid').where({'login_id': email}).then((result) => {
        if (result === 0 || result.length === 0) {
            res.send({message: "Email does not exist"});
        } else {
            userUuid = result[0].user_uuid;
            db('users').select('login_id',).where({'login_id': email, 'login_id_status': 1}).then((result) => {
                if (result.length === 0) {
                    res.send({message: 'Email is not verified'});
                } else {
                    db('users').select('login_id').where({
                        'login_id': email,
                        'pass_word': req.body.password
                    }).then((result) => {
                        if (result === 0 || result.length === 0) {
                            res.send({message: 'Password is not correct'})
                        } else {
                            db('users').where({'login_id': email}).update({'last_login': moment().format()}).then(() => {
                                db('users').select('roles').where({'login_id': email}).then((result) => {
                                    res.send({roles: result[0].roles});
                                })
                            })
                        }
                    })
                }
            });

        }
    })
});


router.get('/getImage', jsonParser, (req, res) => {
    db('profile').select('image_path').where({'primary_email': email}).then((result) => {
        res.send({displayImage: result[0].image_path});
    })
});
router.get('/getProfileInformation', jsonParser, (req, res) => {

    db('profile').select('first_name', 'last_name', 'primary_email', 'secondary_email', 'primary_number', 'secondary_number').where({'primary_email': email})
        .then((result) => {
            res.send({
                firstName: result[0].first_name,
                lastName: result[0].last_name,
                primaryEmail: result[0].primary_email,
                secondaryEmail: result[0].secondary_email,
                primaryNumber: result[0].primary_number,
                secondaryName: result[0].secondary_number
            })
        })
});
router.get('/rejectionReason', jsonParser, (req, res) => {
    let rejection = [];
    db('approval_rejection_reasons').select('approval_rejection_reason').where({
        'email': email,
        'approval_rejection_reason_status': 0
    }).then((result) => {
        for (let i = 0; i < result.length; i++) {
            rejection.push({message: result[i].approval_rejection_reason})
        }
        res.send([rejection])
    })
});
router.get('/jobType', jsonParser, async (req, res) => {
    let jobType = [];
    await db('interests').select('interest_name').then((result) => {
        for (let i = 0; i < result.length; i++) {
            jobType.push({jobType: result[i].interest_name})
        }
        res.send(jobType);
    })
});
router.post('/insertJobType', jsonParser, (req, res) => {
    for (let i = 0; i < req.body.jobType.length; i++) {
        db('interests').select('interest_uuid').where({'interest_name': req.body.jobType[i]}).then((result) => {
            for (let j = 0; j < result.length; j++) {
                db('users_interests')
                    .insert({
                        'interest_uuid': result[j].interest_uuid,
                        'user_uuid': userUuid,
                        'created_at': moment().format(),
                        'updated_at': moment().format()
                    }).then(() => {
                    console.log("Successfull")
                })
            }

        })
    }

});


router.get('/getCategory', jsonParser, async (req, res) => {
    let getCategory = [];
    await db('category').select('category_name').where({'status': 1}).then((result) => {
        for (let i = 0; i < result.length; i++) {
            getCategory.push({value: result[i].category_name, label: result[i].category_name});
        }
        res.send(getCategory);
    });
});
router.get('/getSkillDetail', jsonParser, async (req, res) => {
    let getSkill = [];
    await db('skills').select('skill_name').where({'status': 1}).then((result) => {
        for (let i = 0; i < result.length; i++) {
            getSkill.push({value: result[i].skill_name, label: result[i].skill_name});
        }
        res.send(getSkill);
    })
});

router.get('/logout', jsonParser, (req, res) => {
    db('approval_rejection_reasons').update({
        'approval_rejection_reason_status': 1,
        'updated_at': moment().format()
    }).where({'email': email}).then(() => {
        res.send({message: "Log Out"})
    });
    email = "";
    userUuid = "";
});

router.post('/upload', upload.single('image'), function (req, res) {
    db('image_status').insert({
        'image_path': req.file.path,
        'email': email,
        'image_status': 0,
        'created_at': moment().format(),
        'updated_at': moment().format()
    }).then(() => {
        db('profile').select('image_path').where({'primary_email': email}).then((result) => {
            res.send({displayImage: result[0].image_path, message: 'Send for approval'});
        });
    });
});

router.post('/changePassword', jsonParser, (req, res) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
        res.send({message: 'Password does not match'})
    } else {
        db('users').select('pass_word').where({'pass_word': req.body.currentPassword}).then((result) => {
            if (result.length === 0) {
                res.send({message: 'Current password is not correct'})
            } else {
                db('users').where({'login_id': email}).update({
                    'pass_word': req.body.newPassword,
                    'updated_at': moment().format()
                }).then(() => {
                    res.send({message: 'Password successfully change'})
                })
            }
        })
    }

});

router.post('/insertData', jsonParser, (req, res) => {
    let categoryPosition;
    let skillPosition = 0;
    console.log(req.body.data.skill);
    for (let i = 0; i < req.body.data.length; i++) {
        if (req.body.data[i].category === "" || req.body.data[i].category === null) {
            res.send({message: "Category can not be empty"});
            break;
        } else {
            db('users').update({
                'current_salary': req.body.currentSalary,
                'expected_per_hour_salary': req.body.expectedPerHour,
                'expected_salary': req.body.expectedSalary,
                'updated_at': moment().format()
            }).where({'login_id': email}).then(() => {
                db('category').select('category_uuid').where({'category_name': req.body.data[i].category}).then((result) => {
                    if (result === "" || result.length === 0) {
                        db('category')
                            .insert({
                                'category_name': req.body.data[i].category,
                                'created_at': moment().format(),
                                'updated_at': moment().format(),
                                'user_uuid': userUuid,
                                'status': 0
                            })
                            .then(() => {
                                db('category').select('category_uuid').where({'category_name': req.body.data[i].category}).then((result) => {
                                    let categoryUuid;
                                    categoryUuid = result[0].category_uuid;
                                    for (let j = 0; j < req.body.data[i].skills.length; j++) {
                                        if (req.body.data[i].skills[j].skill === "" || req.body.data[i].skills[j].skill === null) {
                                            res.send({message: "Skill can not be empty"});
                                            break;
                                        } else {
                                            db('skills').select('skill_uuid').where({'skill_name': req.body.data[i].skills[j].skill}).then((result) => {
                                                if (result === "" || result.length === 0) {
                                                    db('skills')
                                                        .insert({
                                                            'skill_name': req.body.data[i].skills[j].skill,
                                                            'created_at': moment().format(),
                                                            'updated_at': moment().format(),
                                                            'status': 0,
                                                            'user_uuid': userUuid
                                                        })
                                                        .then(() => {
                                                            db('skills').select('skill_uuid').where({'skill_name': req.body.data[i].skills[j].skill}).then((result) => {
                                                                let skillUuid;
                                                                skillUuid = result[0].skill_uuid;
                                                                skillPosition = j + 1;
                                                                categoryPosition = i + 1;
                                                                db('profile_skills')
                                                                    .insert({
                                                                        'user_uuid': userUuid,
                                                                        'category_position': categoryPosition,
                                                                        'category_uuid': categoryUuid,
                                                                        'skill_position': skillPosition,
                                                                        'skill_uuid': skillUuid,
                                                                        'skill_experience': req.body.data[i].skills[j].experience,
                                                                        'skill_self_rating': req.body.data[i].skills[j].rating,
                                                                        'skill_self_interest': req.body.data[i].skills[j].interest,
                                                                        'skill_comment': req.body.data[i].skills[j].comment,
                                                                        'created_at': moment().format(),
                                                                        'updated_at': moment().format()
                                                                    }).then(() => {
                                                                    if (j === req.body.data[i].skills.length - 1) {
                                                                        res.send({message: 'Successful'});
                                                                    }
                                                                })
                                                            })
                                                        })
                                                }
                                                else {
                                                    let skillUuid;
                                                    skillUuid = result[0].skill_uuid;
                                                    skillPosition = j + 1;
                                                    categoryPosition = i + 1;
                                                    db('profile_skills')
                                                        .insert({
                                                            'user_uuid': userUuid,
                                                            'category_position': categoryPosition,
                                                            'category_uuid': categoryUuid,
                                                            'skill_position': skillPosition,
                                                            'skill_uuid': skillUuid,
                                                            'skill_experience': req.body.data[i].skills[j].experience,
                                                            'skill_self_rating': req.body.data[i].skills[j].rating,
                                                            'skill_self_interest': req.body.data[i].skills[j].interest,
                                                            'skill_comment': req.body.data[i].skills[j].comment,
                                                            'created_at': moment().format(),
                                                            'updated_at': moment().format()
                                                        }).then(() => {
                                                        if (j === req.body.data[i].skills.length - 1) {
                                                            res.send({message: 'Successful'});
                                                        }
                                                    })
                                                }
                                            })
                                        }

                                    }
                                })
                            });
                    }
                    else {
                        let categoryUuid;
                        categoryUuid = result[0].category_uuid;
                        for (let j = 0; j < req.body.data[i].skills.length; j++) {
                            if (req.body.data[i].skills[j].skill === "" || req.body.data[i].skills[j].skill === null) {
                                res.send({message: "Skill can not be empty"});
                                break;
                            } else {
                                db('skills').select('skill_uuid').where({'skill_name': req.body.data[i].skills[j].skill}).then((result) => {
                                    if (result === "" || result.length === 0) {
                                        db('skills')
                                            .insert({
                                                'skill_name': req.body.data[i].skills[j].skill,
                                                'created_at': moment().format(),
                                                'updated_at': moment().format(),
                                                'status': 0,
                                                'user_uuid': userUuid
                                            })
                                            .then(() => {
                                                db('skills').select('skill_uuid').where({'skill_name': req.body.data[i].skills[j].skill}).then((result) => {
                                                    let skillUuid;
                                                    skillUuid = result[0].skill_uuid;
                                                    skillPosition = j + 1;
                                                    categoryPosition = i + 1;
                                                    db('profile_skills')
                                                        .insert({
                                                            'user_uuid': userUuid,
                                                            'category_position': categoryPosition,
                                                            'category_uuid': categoryUuid,
                                                            'skill_position': skillPosition,
                                                            'skill_uuid': skillUuid,
                                                            'skill_experience': req.body.data[i].skills[j].experience,
                                                            'skill_self_rating': req.body.data[i].skills[j].rating,
                                                            'skill_self_interest': req.body.data[i].skills[j].interest,
                                                            'skill_comment': req.body.data[i].skills[j].comment,
                                                            'created_at': moment().format(),
                                                            'updated_at': moment().format()
                                                        }).then(() => {
                                                        if (j === req.body.data[i].skills.length - 1) {
                                                            res.send({message: 'Successful'});
                                                        }
                                                    })
                                                })
                                            })
                                    }
                                    else {
                                        let skillUuid;
                                        skillUuid = result[0].skill_uuid;
                                        skillPosition = j + 1;
                                        categoryPosition = i + 1;
                                        db('profile_skills')
                                            .insert({
                                                'user_uuid': userUuid,
                                                'category_position': categoryPosition,
                                                'category_uuid': categoryUuid,
                                                'skill_position': skillPosition,
                                                'skill_uuid': skillUuid,
                                                'skill_experience': req.body.data[i].skills[j].experience,
                                                'skill_self_rating': req.body.data[i].skills[j].rating,
                                                'skill_self_interest': req.body.data[i].skills[j].interest,
                                                'skill_comment': req.body.data[i].skills[j].comment,
                                                'created_at': moment().format(),
                                                'updated_at': moment().format()
                                            }).then(() => {
                                            if (j === req.body.data[i].skills.length - 1) {
                                                res.send({message: 'Successful'});
                                            }
                                        })
                                    }
                                })
                            }

                        }
                    }

                });
            })
        }
    }
});

module.exports = router;
