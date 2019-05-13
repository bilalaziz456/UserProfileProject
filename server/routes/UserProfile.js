const express = require('express');
const router = express.Router();
const bodyPaser = require('body-parser');
const db = require('./connection');

let jsonParser = bodyPaser.json();

router.get('/getProfile/:uid', jsonParser, (req, res) => {
    db('users').select('login_id').where({'user_uuid': req.params.uid}).then((result) => {
        if (result.length === 0) {
            res.send({message: 'User does not exist'})
        } else {
            let email = result[0].login_id;
            db('profile').select('profile.image_path', 'profile.first_name', 'profile.last_name', 'profile.primary_email', 'profile.primary_number',
                'country.country', 'city.city')
                .innerJoin('country', 'profile.country_uuid', 'country.country_uuid')
                .innerJoin('city', 'profile.city_uuid', 'city.city_uuid')
                .where({'primary_email': email}).then((result) => {
                res.send({
                    imageURL: result[0].image_path,
                    firstName: result[0].first_name,
                    lastName: result[0].last_name,
                    primaryEmail : result[0].primary_email,
                    primaryNumber : result[0].primary_number,
                    country : result[0].country,
                    city: result[0].city
                });

            })
        }
    })
});
router.get('/getJobType/:uid', jsonParser, (req,res)=>{
    let jobType = [];
    db('users_interests').select('interests.interest_name').innerJoin('interests', 'users_interests.interest_uuid', 'interests.interest_uuid')
        .where({'user_uuid' : req.params.uid}).then((result)=> {
        for(let i = 0; i < result.length; i++){
            jobType.push({
                interestName : result[i].interest_name
            })
        }
        res.send(jobType);
    })
});
router.get('/getProfileDetail/:uid', jsonParser, (req, res) => {

    let userProfile = [];
    db('profile_skills').innerJoin('category','profile_skills.category_uuid', 'category.category_uuid').innerJoin('skills', 'profile_skills.skill_uuid', 'skills.skill_uuid')
        .select('category.category_name', 'skills.skill_name','profile_skills.skill_self_rating', 'profile_skills.skill_experience',
        'profile_skills.skill_self_interest', 'profile_skills.skill_comment').where({'profile_skills.user_uuid' : req.params.uid}).orderBy('profile_skills.category_position', 'asc')
        .orderBy('profile_skills.skill_position', 'asc').then((result)=>{
        for(let i = 0; i < result.length; i++){
            userProfile.push({category : result[i].category_name, skill : result[i].skill_name, rating : result[i].skill_self_rating,
                experience : result[i].skill_experience, interest : result[i].skill_self_interest, comment : result[i].skill_comment
            })
        }
        res.send(userProfile)
    });


});
module.exports = router;