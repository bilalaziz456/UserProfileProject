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
    let getSearch = [];
    let userUuid;
    let bool;
    let skill = [];
    for (let k = 0; k < req.body.skill.length; k++) {
        skill.push(req.body.skill[k].value);
    }
    console.log(skill);
    db('profile_skills').select('profile_skills.user_uuid', 'profile_skills.skill_self_rating', 'profile_skills.skill_self_interest', 'profile_skills.skill_experience ',
        'users.login_id', 'profile.first_name', 'profile.last_name', 'profile.image_path', 'category.category_name', 'skills.skill_name')
        .innerJoin('category', 'profile_skills.category_uuid', 'category.category_uuid')
        .innerJoin('skills', 'profile_skills.skill_uuid', 'skills.skill_uuid')
        .innerJoin('users', 'profile_skills.user_uuid', 'users.user_uuid')
        .innerJoin('profile', 'users.login_id', 'profile.primary_email')
        .whereRaw('cast(profile_skills.skill_self_rating as text) like ?', [`${req.body.rating}%`])
        .andWhereRaw('cast(profile_skills.skill_self_interest as text) like ?', [`${req.body.interest}%`])
        .andWhereRaw('cast(profile_skills.skill_experience as text) like ?', [`%${req.body.experience}%`])
        .andWhereRaw('skills.skill_name  = ANY (?)', [skill]).then((result) => {
        if (result.length === 0) {
            res.send({message: "No result found"});
        } else {
            for (let i = 0; i < result.length; i++) {
                if (userUuid !== result[i].user_uuid) {
                    getSearch.push({
                        imagePath: result[i].image_path,
                        firstName: result[i].first_name,
                        lastName: result[i].last_name,
                        email: result[i].login_id,
                        userUuid: result[i].user_uuid,
                        category: result[i].category_name,
                        skill: result[i].skill_name,
                        rating: result[i].skill_self_rating,
                        interest: result[i].skill_self_interest,
                        experience: result[i].skill_experience

                    });
                    bool = true;
                }
                userUuid = result[i].user_uuid;
            }
            res.send(getSearch)
        }
    });
});

module.exports = router;