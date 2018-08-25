var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');
var yaml = require('js-yaml');
var path = require('path');
var ejs = require('ejs');
var Sequelize = require('sequelize');

var models = require('../models'); 
const {
    VERSION,
    GOOGLE_APP_ID,
    GOOGLE_APP_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    PARTNER_1_KEY,
}  = require('../config/keys');

const initialState = require('../config/data');
const Op = Sequelize.Op;
  
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//SSR function import
const ssr = require('./../views/ssr.js'); 
var crypto = require('crypto');


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
    successRedirect:'/dashboard/'   
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
    callbackURL: "https://keralafights.com/auth/facebook/callback",
    profileFields: ['id',  
        'emails', 
        'displayName', 
        'name', 
        'gender', 
        'picture.type(small)'
    ] ,
    scope:['email']
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
    successRedirect: '/dashboard', 
}));


router.get('/update',function(req,res){

    console.log(req.query);
    if(!req.query.p){
        return res.redirect('/?missing_phone=4'+req.query.p);
    }

    if(!req.query.t || req.query.t.length < 5){
        return res.redirect('/?missing_token=1');
    }
    if(!req.query.n){
        return res.redirect('/?missing_name=1');
    }
    
    if(!req.query.kr){
        return res.redirect('/?missing_ticket_id=1');
    }
    
    const hash = crypto.createHmac('sha1', PARTNER_1_KEY)
        .update(req.query.p+":"+req.query.kr)
        .digest('hex');
         
    console.log('hash:',hash);
    if (hash.indexOf(req.query.t) !== 0) {
        return res.redirect('/?token_missmatch=1');
    }

    models.User.findOne({
        where: {
            phoneNumber:req.query.phoneNumber
        }
    }).then(u => {
        if(u){
            return u;
        }
        return models.User.create({
            name:req.query.n,
            phoneNumber:req.query.p,
            source:'partner',
            email:`ph.${req.query.p}@kf-partner.com`,
            profileLink:'https://d2uvvge0uswb28.cloudfront.net/static/dist/v0/img/profile_default.png'
        });
    }).then(user => {
        return new Promise(function(resolve,reject){
            req.login(user, function(err) {
                if (err) { 
                    return reject(err);
                }
                return resolve(user);

            });
        });
    }).then(item => {
       return models.HelpRequest.findOne({
            where:{
                remoteId:req.query.kr,
                source:'www.keralarescue.in'
            }
        });
    }).then(item=>{
        if (!item){
            return res.redirect(`/missing_kr_id=${req.query.kr}`)
        }
        return res.redirect('/dashboard/' + item.id);
    }).catch(ex => {
        console.log(ex);
        return res.redirect('/login_failed');
    })

});

router.get([  
    '/manage/:status?/:page?',
    '/dashboard/:requestId?'
    ], googleAuth,(req, res) => {
    let context = {};
    initialState.authUser = req.user;
    initialState.searchText = '';
    
    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=5') 
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
    '/requests/:status?/:page?',
    '/heatmap/:status?', 
    '/search/:query/:page',
    '/new',
    '/home/:action?',
    '/service-providers/:status?/:page?',
    '/',
    ], (req, res) => {
    let context = {};
    initialState.authUser = req.user;
    initialState.searchText = '';

    const { preloadedState, content}  = ssr(req,context,initialState); 
    res.setHeader('Cache-Control', 'assets, max-age=5') 
    res.render('index',{
        title:'Kerala Fights',
        version:VERSION,
        state:preloadedState,
        content:''
    })
});   
module.exports = router;
