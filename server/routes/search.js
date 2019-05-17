const express = require('express');
const router = express.Router();
const bodyPaser = require('body-parser');
const db = require('./connection');

let jsonParser = bodyPaser.json();
router.get('/getSuggestion', jsonParser, (req, res) => {
    let skills = [];
    db('skills').select('skill_name').then((result) => {
        for (let i = 0; i < result.length; i++) {
            skills.push({label: result[i].skill_name, value: result[i].skill_name})
        }
        res.send(skills)
    })
});

router.post('/search', jsonParser, (req, res) => {
    let skillMap = {};
    let obj;
    let skillUuid;
    db('skills').select('skill_name', 'skill_uuid').then((result) => {
        for (let j = 0; j < result.length; j++) {
            skillMap[result[j].skill_name] = result[j].skill_uuid;
            console.log(skillMap);
        }

        let query = db('users').select('users.user_uuid', 'users.login_id', 'profile.first_name', 'profile.last_name', 'profile.image_path')
            .innerJoin('profile', 'users.login_id', 'profile.primary_email')
            .whereRaw('1 = 1');


        for (let i = 0; i < req.body.sendData.length; i++) {
            let searchDataRow = req.body.sendData[i];
            if (searchDataRow.skill === '') {
                res.send({message: 'Skill can not be empty'});
                break;
            } else if (searchDataRow.fromRating === '' || searchDataRow.toRating === '') {
                res.send({message: 'Rating can not be empty'});
                break;
            } else if (searchDataRow.fromRating > searchDataRow.toRating) {
                res.send({message: 'FROM rating can not greater then TO rating'});
                break;
            } else if (searchDataRow.fromInterest === '' || searchDataRow.toInterest === '') {
                res.send({message: 'Interest can not be empty'});
                break;
            } else if (searchDataRow.fromInterest > searchDataRow.toInterest) {
                res.send({message: 'FROM interest can not greater then TO interest'});
                break;
            } else if (searchDataRow.fromExperience === '' || searchDataRow.toExperience === '') {
                res.send({message: 'Experience can not be empty'});
                break;
            } else if (searchDataRow.fromExperience > searchDataRow.toExperience) {
                res.send({message: 'FROM experience can not greater then TO experience'});
                break;
            } else {
                obj = searchDataRow;
                skillUuid = skillMap[obj.skill];
                let subQuery = db('profile_skills').select('user_uuid')
                    .where({'skill_uuid': skillUuid})
                    .whereBetween('skill_self_rating', [searchDataRow.fromRating, searchDataRow.toRating])
                    .whereBetween('skill_self_interest', [searchDataRow.fromInterest, searchDataRow.toInterest])
                    .whereBetween('skill_experience', [searchDataRow.fromExperience, searchDataRow.toExperience]);
                query.whereIn('users.user_uuid', subQuery);
            }
        }
        query.then((result) => {
            if (result.length === 0) {
                res.send({message: 'No result found'})
            } else {
                res.send(result);

            }
        });
    });
});

module.exports = router;