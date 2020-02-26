const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/Users');
const key = require('../../config/keys').secret;

/**
*@route POST api/users/register
* @desc Register the users
* @access Public
 */

router.post('/register', (req, res)=>{
    let{name, 
        username, 
        email,
        password,
        confirm_password,
        role
    }=req.body
    if(password!==confirm_password){
        return res.status(400).json({
            msg:"passwords do not match"
        });
    }
    //check if email is unique
    User.findOne({
        username:username
    }).then(user => {
        if(user){
            return res.status(400).json({
                msg:"Username already exists"
            });
        }
    });

    User.findOne({
        email:email
    }).then(user=>{
        if(user){
            return res.status(400).json({
                msg: "Email already exists"
            });
        }
    });

    //Valid data
    let newUser = new User({
        name,
        username,
        password,
        email,
        role

    });

    //Has the password
    bcrypt.genSalt(10, (error, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            newUser.password = hash;
            newUser.save().then(user =>{
                return res.status(201).json({
                    success:true,
                    msg: "User Registered"
                });
            });
        });
    });
});


/**
*@route POST api/users/login
* @desc login the users
* @access Public
 */

 router.post('/login', (req,res)=>{
     //Check is username exist
     User.findOne({
         username: req.body.username
     }).then(user => {
         if(!user){
             return res.status(404).json({
                 msg: "Username does not exist",
                 success:false
             });
         }

         //If the User exist, check if passwords match
         bcrypt.compare(req.body.password, user.password)
         .then(isMatch=>{
             if(isMatch){
                 const payLoad= {
                     _id: user._id, 
                     username:user.username,
                     name:user.name,
                     email:user.email,
                     role:user.role
                 }
                 jwt.sign(payLoad, key, {
                     expiresIn: 86400
                 }, (err, token)=>{
                     res.status(200).json({
                         success:true,
                         token:`Bearer ${token}`,
                         msg:"Successfully logged in"
                     })
                 });
             }else{
                 return res.status(404).json({
                     msg:"Password does not match user",
                     success:false
                 })
             }
         })

     })
 })

 /**
*@route GET api/users
* @desc Get the users
* @access Public
 */

 router.get('/profile', passport.authenticate('jwt', {
     session: false
 }), (req, res)=>{
    return res.json({
       user : req.user
    })
 });


 module.exports= router;