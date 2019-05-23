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
    let interestMap = [];
    let interestUuid;
    db('skills').select('skill_name', 'skill_uuid').then((result) => {
        for (let j = 0; j < result.length; j++) {
            skillMap[result[j].skill_name] = result[j].skill_uuid;
        }
        db('interests').select('interest_uuid', 'interest_name').then((result) => {
            for (let i = 0; i < result.length; i++) {
                interestMap[result[i].interest_name] = result[i].interest_uuid
            }
            let query;
            query = db('users').select('users.user_uuid', 'users.login_id', 'profile.first_name', 'profile.last_name', 'profile.image_path')
                .distinct('users.user_uuid')
                .innerJoin('profile', 'users.login_id', 'profile.primary_email')
                .innerJoin('country', 'profile.country_uuid', 'country.country_uuid')
                .innerJoin('city', 'city.country_uuid', 'country.country_uuid')
                .innerJoin('users_interests', 'users.user_uuid', 'users_interests.user_uuid')
                .whereRaw('1 = 1');
            if (req.body.country !== '') {
                query.andWhere({'country.country': req.body.country})
            }
            if (req.body.city !== '') {
                query.andWhere({'city.city': req.body.city})
            }
            if (req.body.currentSalary !== '') {
                query.andWhere({'users.current_salary': req.body.currentSalary})
            }
            if (req.body.expectedPerHour !== '') {
                query.andWhere({'users.expected_per_hour_salary': req.body.expectedPerHour})
            }
            if (req.body.expectedSalary !== '') {
                query.andWhere({'users.expected_salary': req.body.expectedSalary})
            }
            for (let i = 0; i < req.body.sendData.length; i++) {
                let searchDataRow = req.body.sendData[i];
                if (searchDataRow.skill === '') {
                    res.send({message: 'Skill can not be empty'});
                    break;
                }  else if (searchDataRow.fromRating > searchDataRow.toRating) {
                    res.send({message: 'FROM rating can not greater then TO rating'});
                    break;
                } else if (searchDataRow.fromInterest > searchDataRow.toInterest) {
                    res.send({message: 'FROM interest can not greater then TO interest'});
                    break;
                } else if (searchDataRow.fromExperience > searchDataRow.toExperience) {
                    res.send({message: 'FROM experience can not greater then TO experience'});
                    break;
                } else if(searchDataRow.fromRating === '' && searchDataRow.toRating !== ''){
                    res.send({message: 'Enter FROM rating'});
                    break;
                } else {
                    obj = searchDataRow;
                    skillUuid = skillMap[obj.skill];
                    let subQuery = db('profile_skills').select('user_uuid');
                    if(searchDataRow.fromRating !== '' && searchDataRow.toRating !== ''){
                        subQuery.whereBetween('skill_self_rating', [searchDataRow.fromRating, searchDataRow.toRating])
                    }
                    if(searchDataRow.fromInterest !== '' && searchDataRow.toInterest !== ''){
                        subQuery.whereBetween('skill_self_interest', [searchDataRow.fromInterest, searchDataRow.toInterest])
                    }
                    if(searchDataRow.fromExperience !== '' && searchDataRow.toExperience !== ''){
                        subQuery.whereBetween('skill_experience', [searchDataRow.fromExperience, searchDataRow.toExperience]);
                    }

                    if (req.body.jobType.length === 0) {
                        query.whereIn('users.user_uuid', subQuery);
                    }
                    else {
                        for (let j = 0; j < req.body.jobType.length; j++) {
                            interestUuid = interestMap[req.body.jobType[j]];
                            let interestSubQuery = db('users_interests').select('user_uuid').where({'interest_uuid': interestUuid});
                            query.whereIn('users.user_uuid', interestSubQuery)
                                .whereIn('users.user_uuid', subQuery);
                        }
                    }

                }
            }
            query.then((result) => {
                if (result.length === 0) {
                    res.send({message: 'No result found'})
                } else {
                    res.send(result)
                }
            });
        })
    });
});

module.exports = router;