

const express = require('express');
const router = express.Router();
const moment = require('moment');
const Sequelize = require('sequelize');
const models = require('./../../models');
const {jsonError,jsonSuccess,filterFromQuery} = require('./../../services/utils'); 

router.post('/add',function(req,res) {
    try {
        const data = req.body;        
        const passed = {
            contactName: data.contactName,
            phoneNumber: data.phoneNumber,
            type: data.type,
            address: data.address,
            district: data.district,
            peopleCount: data.peopleCount,
            kidsCount: data.kidsCount,
            maleCount: data.maleCount,
            femaleCount: data.femaleCount,
            information: data.information,
            latLng: {
                type: 'Point',
                coordinates: [data.location_lat,data.location_lon]
            },
            latitude: data.location_lat,
            longitude: data.location_lon,
            serviceEndDate: data.serviceEndDate
        };

        models.MarkedLocation.findOrCreate({
            where:{
                phoneNumber:data.phoneNumber
            },
            defaults:passed
        }).then(resp => {
            res.json(jsonSuccess({
                db: resp,
                passed: passed,
                send: data
            }));
        });
    } catch(ex){
        console.log(ex);
        res.json(jsonError('Missing parameters' , {...req.body}) );
    }   
});

router.get('/list',function(req,res){
    const params = filterFromQuery(req.query);
    let whereQuery = {};
    
    if (req.query.q) {
        const ors = {
            phoneNumber: {
                [Op.iLike]: `${req.query.q}%`
            },
            contactName: {
                [Op.iLike]:`${req.query.q}%`
            }
        }
        whereQuery = {
           [Op.or]: ors
        } 
    }

    if (req.query.requestType){
        whereQuery.type = req.query.requestType;
    }

    if (req.query.district){
        whereQuery.district = req.query.district;
    }

    let sortOptions = [
        ['createdAt','DESC']
    ];
    if (req.query.sortOn == 'oldest') {
        sortOptions = [ 
            ['createdAt','ASC'],
        ];
    }

    models.MarkedLocation.findAll({
        where: whereQuery,
        order:sortOptions,
        offset: (params.page -1)*params.per_page,
        limit: params.per_page
    }).then(list => {
        let totalCount = null;
        return models.MarkedLocation.count({
            where: whereQuery,
        }).then(count => {
            totalCount = count;
            return models.MarkedLocation.sum('peopleCount', {
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