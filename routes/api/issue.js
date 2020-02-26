const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Issue = require('../../models/Issue');
const key = require('../../config/keys').secret;




//Post Issue
router.post("/new_issue", passport.authenticate('jwt', {
    session: false
})
, (req, res)=>{
    let{
        username,
        description_of_issue,
        solution,
        doctor
    }=req.body

    if(!username){
        return res.status(400).json({
            msg:"Enter your username"
        });
    }

    if(!description_of_issue){
        return res.status(400).json({
            msg:"Enter your issue"
        });
    }

    let newIssue = new Issue({
        username,
        description_of_issue,
        solution,
        doctor
    });

    User.findOne({
        username: req.body.username
    }).then(user => {
        if(!user){
            return res.status(404).json({
                msg: "Username does not exist",
                success:false
            });
        }

        newIssue.save().then(user =>{
            return res.status(201).json({
                success:true,
                msg: "Data inserted"
            });
        });
    })

    
});


//GetAll issues

router.get('/issues', passport.authenticate('jwt', {
    session: false
}), (req, res)=>{
   return res.json({
      issue : req.issues
   })
});



module.exports= router;



