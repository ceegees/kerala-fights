var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');
var yaml = require('js-yaml');
var path = require('path');
var ejs = require('ejs');
var Sequelize = require('sequelize');

var models = require('../models');
const VERSION = 1.6;

const initialState = require('../config/data');
const Op = Sequelize.Op;
  
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

GOOGLE_APP_ID = '634343394363-lgpiebfiddkac72v25ao1ld1b3tnre8i.apps.googleusercontent.com';
GOOGLE_APP_SECRET = 'Z0KAE4ZU2rnX5kt0qSVsbm4T'

// FACEBOOK_APP_ID = '756308454761013'; // test idsss
// FACEBOOK_APP_SECRET = '27525342c32b054d7056fcdeb6f072f3';


FACEBOOK_APP_ID = '286493875499029'; // live ids
FACEBOOK_APP_SECRET = '39147871f13aaefa2f2ae07f9f37a33f';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_APP_ID,
    clientSecret: GOOGLE_APP_SECRET, 
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read'
    ],
    callbackURL: "/auth/google-callback"
  },function(accessToken, refreshToken, profile, cb) { 
    const refId = `https://plus.google.com/${profile.id}`;
    const email = profile.emails[0].value;
    models.User.findOne({
        where: {
            [Op.or]: {
                providerId: refId,
                email: email
            } 
        }
    }).then(res => {
        if (res){
            return res;
        }
        let  photoLink = null;
        if (profile.photos.length > 0){
            photoLink = profile.photos[0].value;
        }
        return models.User.create({
            name: profile.displayName,
            providerId: refId,
            type: 'User',
            email: email, //if email is not there fail
            profileLink : photoLink,
            status: 'ACTIVE'
        });
    }).then(user => {
        cb(null,user);
    }).catch(ex => {
        cb(null,false)
        console.log('Error',ex);
    })
  }
));


router.get('/auth/google-callback', passport.authenticate('google',{
    failureRedirect: '/?failed_login=true',
    successRedirect:'/manage'   
})); 

router.get('/auth/google', passport.authenticate('google'));

function googleAuth(req,res,next){
    if (req.user )  {
        next();
        return;
    }
    res.redirect('/auth/google'); 
}

// **** Facebook Auth **** //
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'displayName', 'name', 'gender', 'picture.type(small)'] //This
},

function(accessToken, refreshToken, profile, done) {
        const refId = `https://facebook.com/${profile.id}`;
        const email = profile.emails[0].value;
        models.User.findOne({
            where: {
                [Op.or]: {
                    providerId: refId,
                    email: email
                } 
            }
        }).then(resp => { 
            if (resp) {
                return resp;
            }

            let  photoLink = null;
            if (profile.photos.length > 0){
                photoLink = profile.photos[0].value;
            }
          
            return models.User.create({
                name: profile.displayName,
                providerId: refId,
                type: 'User',
                email: email,
                profileLink: photoLink,
                status:'ACTIVE'
            });
        }).then(user => {
            done(null, user);
        }).catch(ex => {
            done(null, false);
            console.log('Error', ex);
        });
    }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/?failed_login=true',
    successRedirect: '/manage', 
}));

//SSR function import
const ssr = require('./../views/ssr.js'); 

router.get([  
    '/manage/:status?/:page?'
    ], googleAuth,(req, res) => {
    let context = {};
    initialState.authUser = req.user;
    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=60') 
    res.render('index',{

        version:VERSION,
        title:'Kerala Fights',
        state:preloadedState,
        content:''
    })
});   

router.get('/disclaimer',function(req,res){
    res.render('disclaimer');
})
router.get([ 
    '/heatmap/:status?', 
    '/new',
    '/:action?',
    '/service-providers/:status?/:page?',
    '/',
    ], (req, res) => {
    let context = {};
    initialState.authUser = req.user;
    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=60') 
    res.render('index',{
        title:'Kerala Fights',
        version:VERSION,
        state:preloadedState,
        content:''
    })
});   
module.exports = router;
