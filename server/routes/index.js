var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');
var yaml = require('js-yaml');
var path = require('path');
var ejs = require('ejs');

var models = require('../models');

const initialState = require('../config/data');
  
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

GOOGLE_APP_ID = '634343394363-lgpiebfiddkac72v25ao1ld1b3tnre8i.apps.googleusercontent.com';
GOOGLE_APP_SECRET = 'Z0KAE4ZU2rnX5kt0qSVsbm4T'

FACEBOOK_APP_ID = '756308454761013';
FACEBOOK_APP_SECRET = '27525342c32b054d7056fcdeb6f072f3';

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
    models.User.findOne({
        where:{
            providerId:refId
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
            providerId:refId,
            type:'User',
            email:profile.emails[0].value,//if email is not there fail
            profileLink :  photoLink,
            status:'ACTIVE'
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

function googleAuth(req,res,next) {
    if (req.session.passport && req.user )  {
        next();
    }
    res.redirect('/auth/google'); 
}

// **** Facebook Auth **** //
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'displayName','name','gender', 'picture.type(small)'] //This
},

function(accessToken, refreshToken, profile, done) {
        const refId = `https://facebook.com/${profile.id}`;
        
        console.log('fb user ',profile);
        models.User.findOne({
            where: {
                provider_id: refId
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
                email: profile.emails[0].value,
                profileLink: photoLink,
                status:'ACTIVE'
            });
        }).then(user => {
            console.log('at second then', user);
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
    '/heatmap/:status?', 
    '/service-providers/:status?/:page?',
    '/',
    ], (req, res) => {
    let context = {};
    initialState.authUser = req.user;
    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=604800') 
    res.render('index',{
        title:'Kerala Fights',
        state:preloadedState,
        content:''
    })
});   
router.get([  
    '/manage/:status?/:page?'
    ], googleAuth,(req, res) => {
    let context = {};

    initialState.authUser = req.user;
    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=604800') 
    res.render('index',{
        title:'Kerala Fights',
        state:preloadedState,
        content:''
    })
});   
module.exports = router;
