const express = require('express');
const router = express.Router();
const moment = require('moment');
const Sequelize = require('sequelize');
const models = require('./../../models');
const {jsonError,jsonSuccess,filterFromQuery} = require('./../../services/utils'); 


router.post('/rescue/volunteer/register', function(req,res) {
    let name = req.body.name;
    let phoneNumber = req.body.phoneNumber
    let type = req.body.type;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let info = req.body.info;
    let peopleCount = req.body.peopleCount;
    if (parseInt(peopleCount)) {
        peopleCount = parseInt(peopleCount);
    } else {
        peopleCount = 0;
    }

    const phoneRegExp = /^[0-9]{10}$/; 

    if (!name) {
        return res.json({
            success: false,
            message: "Name is required"
        });
    } else if (!phoneNumber) {
        return res.json({
            success: false,
            message: "Phone Number is required"
        });
    } else if (!phoneNumber.match(phoneRegExp)) {
        return res.json({
            success: false,
            message: "Invalid Phone Number"
        });
    } else if (!type) {
        return res.json({
            success: false,
            message: "Rescue Type is required"
        });
    } else if (!latitude || !longitude) {
        return res.json({
            success: false,
            message: "Location detail is required."
        });
    }

    models.RescueVolunteer.findOrCreate({
        where: {
            phoneNumber: phoneNumber
        },
        defaults: {
            name: name,
            type: type,
            latitude: latitude,
            longitude: longitude,
            info: info,
            peopleCount: peopleCount
        }
    }).spread((resVol, created) => {
        if (! created) {
            resVol.set('name', name);
            resVol.set('type', type);
            resVol.set('latitude', latitude);
            resVol.set('longitude', longitude);
            resVol.set('info', info);
            resVol.set('peopleCount', peopleCount);
            return resVol.save();
        } else {
            return resVol;
        }
    }).then(data => {
        res.json({
            success: true,
            message: "Added Successfully."
        });
    }).catch(err => {
        res.json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    });
});

router.post('/rescue/volunteer/status/update', function(req,res) {
    let phoneNumber = req.body.phoneNumber;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let status = req.body.status;
    let info = req.body.info;

    const phoneRegExp = /^[0-9]{10}$/; 

    if (!phoneNumber) {
        return res.json({
            success: false,
            message: "Phone Number is required"
        });
    } else if (!phoneNumber.match(phoneRegExp)) {
        return res.json({
            success: false,
            message: "Invalid Phone Number"
        });
    } else if (!latitude || !longitude) {
        return res.json({
            success: false,
            message: "Location detail is required."
        });
    }

    models.RescueVolunteer.find({
        where: {
            phoneNumber: phoneNumber
        }
    }).then(resVol => {
        if (!resVol) {
            throw "Rescue Volunteer not found";
        }
        return resVol.update({
            'latitude': latitude,
            'longitude': longitude,
            'status': (status)?'ACTIVE':'INACTIVE',
            'info': info
        });
    }).then(result => {
        res.json({
            success: true,
            message: "Data updated."
        });
    }).catch(err => {
        res.json({
            success: false,
            message: err
        });
    });
});

router.get('/volunteer-list',function(req,res){
    const params = filterFromQuery(req.query);
    let whereQuery = {};
    
    if (req.query.q) {
        const ors = {
            phoneNumber: {
                [Op.like]: `${req.query.q}%`
            },
            name: {
                [Op.like]:`${req.query.q}%`
            }
        }
        whereQuery = {
           [Op.or]: ors
        } 
    }

    if (req.query.requestType){
        whereQuery.type = req.query.requestType;
    }

    let sortOptions = [
        ['createdAt','DESC']
    ];
    if (req.query.sortOn == 'oldest') {
        sortOptions = [ 
            ['createdAt','ASC'],
        ];
    }

    whereQuery.status = 'ACTIVE';
    if (req.query.status) {
        whereQuery.status = req.query.status;
    }
    
    models.RescueVolunteer.findAll({
        where: whereQuery,
        order:sortOptions,
        offset: (params.page -1)*params.per_page,
        limit: params.per_page
    }).then(list => {
        let totalCount = null;
        return models.RescueVolunteer.count({
            where: whereQuery,
        }).then(count => {
            totalCount = count;
            return models.RescueVolunteer.sum('peopleCount', {
                where: whereQuery,
            });
        }).then(fulfillCount => {
            return {
                total: totalCount,
                fulfillableCount: (fulfillCount)?fulfillCount:0,
                page: params.page,
                page_max: Math.floor(totalCount /params.per_page),
                per_page: params.per_page,
                list: list
            }
        });
    }).then(data =>{
        res.json(jsonSuccess(
            data
        ));
    });

});

module.exports = router;