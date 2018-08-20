const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const service = require('../services/google.js');
const models = require('../models');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(require('../config/config'));
const {statusList} = require('../config/data');
const Op = Sequelize.Op;
const moment = require('moment');
function filterFromQuery(query,def={}){
    if (query.mode == 'refresh'){
        delete query.mode;
        clearCache();
    }
    const filter = Object.assign(def,{
        page:query.page ? query.page:1, 
        per_page:40
    });   
    for(var name in query){
        filter[name] = query[name];
    }
    return filter;
}


function jsonError(message = 'Error',data = null) {
    return {
        meta:{
            success:false,
            message:message,
        },
        data:data
    };
}

function jsonSuccess(data = null,message='Ok') {
    return {
        meta:{
            success:true,
            message:message,
        },
        data:data
    };
}

router.get('/auth-user',function(req,res){
    res.json(jsonSuccess(req.user)); 
});

router.get('/message', function (req, res, next) {
    res.json({ title: 'Ceegees' });
});

router.get('/rescue-duplicates',function(req,res){
    sequelize.query(`SELECT 
        phone_number,
        count(*) as totalRequests ,
        min(created_at) as minCreated , 
        min(remote_id) as minRemote
    FROM 
        help_requests 
    WHERE
        parent_id is NULL
    GROUP BY 
        phone_number 
    HAVING 
        count(*) > 1
    ORDER BY
        totalRequests DESC 
    LIMIT 1000`,{  
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT
    }).then(list=>{
        res.json(list);
    });

});



router.get('/sheet',function(req,res) {
    const sheetId = "1sBOM5sZB3M60Jiz-SXw51ZZmlQaOhRyiZiitIcPAr7s";
    const sheetName = `ADD HELP REQUESTS(1)!A1:J1000`
    const sheets = google.sheets('v4');
    service()
    .then(client => {
        return sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId: sheetId,
            range: sheetName
        });
    }).then(response => {
        const header = response.data.values.shift();
        const feed = response.data.values.reduce((acc,item,idx)=>{
            const def = {
                "MessageStatus": "Not Sent",
                "ReviewStatus":"0",
                Row:(idx+2)
            };
            acc.push(item.reduce((obj,col,idx)=>{
                obj[header[idx]] = col;
                return obj;
            },def));
            return acc;
        },[]);
        res.json(feed)
    })
    .catch(err => {
        console.log("Error",err);
        res.json(err);
    }); 
});
router.get('/sync',function(req,res) {

    const sheetId = 
    //"1MbCBl5AYs3PgdPcrIz6nFR98y3acUIa73Ba_Wh2EmEc";
    "1eXLEA4UW2Eq4KKcCv_9scHL_xDj0fadLd3VxyqCYu94";
    const sheetName = `Ernakulam!A1:P5000`;
    const sheets = google.sheets('v4');

    service()
    .then(client => {
        return sheets.spreadsheets.values.get({
            auth: client,
            spreadsheetId: sheetId,
            range: sheetName
        });
    }).then(response => {
        // const header = response.data.values.shift();
        // const feed = response.data.values.reduce((acc,item,idx)=>{
        //     const def = {
        //         "MessageStatus": "Not Sent",
        //         "ReviewStatus":"0",
        //         Row:(idx+2)
        //     };
        //     acc.push(item.reduce((obj,col,idx)=>{
        //         obj[header[idx]] = col;
        //         return obj;
        //     },def));
        //     return acc;
        // },[]);
        res.json(response.data.values)
    })
    .catch(err => {
        console.log("Error",err);
        res.json(err);
    }); 
});

router.get('/rescue-status',function(req,res){
    sequelize.query("SELECT count(*) as total, status from help_requests group by status",{  
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT
    })
    .then(resp =>{
        res.json(jsonSuccess(resp)) ;
    }).catch(ex => {
        console.log(ex);
        res.json(jsonError(ex.message));
    })
});
 
router.get('/rescue-worklog',function(req,res){
    let request = null;
    models.HelpRequest.find({
        where:{id:req.query.id},
        include :[ { 
            model: models.User ,as:'operator' 
        }]
    }).then(item => {
        if (item.operatorLockAt != null) {
            return item;
        }
        if (!req.user){
            return item;
        }
        item.operatorId = req.user.id
        item.operatorLockAt = new Date();
        return item.save()
    }).then(item => {
        request = item;
        return models.WorkLog.findAll({
            where:{
                requestId:item.id
            },
            order:[
                ['createdAt','DESC']
            ],
            include :[ { 
                model: models.User ,as:'actor' 
            }]
        });
    }).then(list =>{
        res.json(jsonSuccess({
            request:request,
            log:list
        }));
    }).catch(ex => {
        console.log(ex);
        res.json(jsonError(ex.message));
    })
});


router.post('/rescue-release-lock',function(req,res){
    models.HelpRequest.findById(req.body.id).then(item => {
        if (req.user && req.user.id == item.operatorId){
            item.operatorId = null;
            item.operatorLockAt = null;
            return item.save()
        } else {
            return item;
        }
    }).then(item => {
        res.json(jsonSuccess(item));
    }).catch(ex => {
        res.json(jsonError(ex.message));
    })
})


router.post('/rescue-update',function(req,res){
    let rescue = null;
    const user = req.user;
    if (!user){
        return res.json(jsonError("You need to login to complete this action,you will be redirected now"));
    }
    let {status,comments,severity} = req.body;
    let currentMove = null;

    models.HelpRequest.findById(
        req.body.id
    ).then(item =>{
        if (!item){
            throw new Error("Invalid id")
        }    
        if (!status){
            throw new Error ("Status is required");
        }
          
        if (!comments){
            throw new Error ("Comment is required");
        }

        if (!severity){
            throw new Error ("Severity is required");
        }
        if (isNaN(severity)){
            throw new Error("Incorrect value of severity");
        }

        status = status.toUpperCase();
        rescue = item;
        const currentStatus = rescue.status.toLowerCase();
        const transitions = statusList.find(i => i.key == currentStatus);
        const valid = transitions.nextStates.find(i => i.value.toUpperCase() == status);
        if (!valid){
            throw new Error('Invalid status change');
        }
        currentMove = valid;
        return item;
    }).then(item => {
        return models.WorkLog.create({
            requestId:item.id,
            actorId:user.id,
            statusIn:item.operatorStatus.toUpperCase(),
            statusOut:status,
            comments:""+comments + "\nSeverity: " +severity,
        });
    }).then(workLog=>{
        console.log(currentMove);
        rescue.status = currentMove.target.toUpperCase();
        rescue.operatorStatus = status;
        rescue.operatorSeverity = severity;
        rescue.operatorId = null;
        rescue.operatorLockAt = null;
        rescue.operatorUpdatedAt = new Date();
        return rescue.save();
    }).then(item => {
        res.json(jsonSuccess(item));
    }).catch(ex => {
        console.log(ex);
        res.json(jsonError(ex.message))
    });
});


router.get('/rescue-list',function(req,res){
    const params = filterFromQuery(req.query,{status:'NEW'})
    params.status = params.status.toLowerCase();
    const state = statusList.find(i => i.key == params.status);
    let whereQuery = null;
    if (params.status == 'duplicates'){
        if (params.q){
            whereQuery = {
                [Op.or] : {
                    parentId:params.q,
                    id:params.q
                }
            }
        } else {
            whereQuery = {
                parentId:{
                    [Op.ne] :null
                }
            }
        }
        
    } else if (req.query.q){
        const parts = req.query.q.split('-');
        const ors = {
            phoneNumber:{
                [Op.eq]: req.query.q
            },
            personName:{
                [Op.like]:`${req.query.q}%`
            },
            district:{
                [Op.like]:`${req.query.q}%`
            }
        } 
        if (!isNaN(parts[0]) && (""+parts[0]).length < 8){
            ors.id = parts[0];
            ors.parentId = parts[0];
            ors.remoteId = parts[0];
        }
        whereQuery = {
           [Op.or] :ors
        } 
    } else {
        if (!state){
            res.json(jsonError("Invalid status"));
        }
        whereQuery = {
            status: {
                [Op.in]:state.db
            },
            parentId:null
        };

        if (req.query.district){
            whereQuery.district = req.query.district;
        }
        if (req.query.startAt && req.query.endAt){
            whereQuery.createdAt = {
                [Op.between] : [
                    moment.unix(req.query.startAt/1000).toDate(),
                    moment.unix(req.query.endAt/1000).toDate()
                ]
            }
        }
    }

    if (req.query.location){
        whereQuery = { 
            latLng: {
                [Op.ne] :null
            }
        }
        if (state){
            whereQuery.status = state.db;
        }
    }

    models.HelpRequest.findAll({
        where:whereQuery,
        order:[ 
            ['operatorLockAt','DESC NULLS FIRST'],
            ['createdAt','DESC']
        ],
        offset:(params.page -1)*params.per_page,
        limit:params.per_page,
        include :[ { 
            model: models.User ,as:'operator' 
        }]
    }).then(list => {
        return models.HelpRequest.count({
            where:whereQuery,
        }).then(count => {
            return {
                total:count,
                page:params.page,
                page_max:Math.floor( count /params.per_page),
                per_page:params.per_page,
                list:list
            }
        })
    }).then(data =>{
        res.json(jsonSuccess(
            data
        ));
    });
});

router.post('/resuce-edit',function(req,res){
    
        const data = req.body;       
        let rescue = null
        models.HelpRequest.findById(data.id)
        .then(r => {
            if (!r){
                throw new Error("Invalid id");
            }
            rescue = r;
            return models.WorkLog.create({
                requestId:rescue.id,
                actorId:req.user.id,
                statusIn:rescue.status,
                statusOut:rescue.status,
                comments: 'DATA_EDIT:'+JSON.stringify(rescue)
            })
        }).then(log => {
        
            rescue.personName = data.personName;
            rescue.phoneNumber = data.phoneNumber;
            rescue.address = data.address;
            rescue.memberCount = data.memberCount;
            rescue.latLng= {
                type:'Point',
                coordinates:[
                   parseFloat(""+ data.location_lat),
                   parseFloat(""+ data.location_lon)
                ]
            };
            var newInfo = {
                detailrescue:data.detailrescue,
                needrescue:data.detailrescue !="",
                detailwater:data.detailwater,
                needwater:data.detailwater != "",
                detailtoilet:data.detailtoilet,
                needtoilet:data.detailtoilet != "", 
                detailfood:data.detailfood,
                needfood:data.detailfood != "",
                detailmed:data.detailmed,
                needmed:data.detailmed!= "",
                detailkit_util:data.detailkit_util,
                needkit_util : data.detailkit_util != "",
                detailcloth:data.detailcloth ,
                needcloth:data.detailcloth !="" ,
            }
            rescue.json.info = Object.assign(rescue.json.info||{},newInfo);
            rescue.json.location = {
                lat:parseFloat(""+ data.location_lat),
                lon:parseFloat(""+ data.location_lon)
            }
            rescue.json.input = Object.assign(rescue.json.input||{},{
                location_lat:data.location_lat,
                location_lon : data.location_lon, 
                google_address:data.address_components
            });
            return rescue.save();
        }).then(data => {
            
            res.json(jsonSuccess(data));
        }).catch(ex =>{
            console.log(ex);
            res.json(jsonError(ex.message));
        });
          
})

router.post('/add-rescue',function(req,res){ 
    try {
        const data = req.body;        
        const passed = {
            phoneNumber:data.phone_number,
            personName : data.name,
            district: data.district,
            type : data.help_type,
            location:data.location,
            memberCount:data.member_count,
            address:data.address +"\n"+ data.alternate_numbers,
            powerBackup:data.power_backup,
            information:data.member_details,
            source:'keralafights',
            status:'NEW',
            latLng:{
                type:'Point',
                coordinates:[data.location_lat,data.location_lon]
            },
            json:{
                input:{
                    alternate_numbers:data.alternate_numbers,
                    address:data.address,
                    location_lat:data.location_lat,
                    location_lon : data.location_lon,
                    details:data.details,
                    google_address:data.address_components
                },
                tags:[
                ],
                workLog:[
                    {
                        owner : data.name,
                        message:'Request received',
                        at:new Date().getTime()
                    }
                ]
            }
        };
        models.HelpRequest.create(passed).then(resp => {
            res.json(jsonSuccess({
                db:resp,
                passed:passed,
                send:data
            } ));
        })
    }catch(ex){
        console.log(ex);
        res.json(jsonError('Missing parameters' , {...req.body}) );
    }
        
});


router.post('/add-safe-user',function(req,res){ 
    try {
        const data = req.body;        
        const passed = {
            name: data.name,
            phoneNumber: data.phoneNumber,
            currentLocationType: data.currentLocationType,
            contactInfo: data.contactInfo,
            type: data.type,
            creatorName: data.creatorName,
            creatorPhone: data.creatorPhone,
            latLng: {
                type: 'Point',
                coordinates: [data.location_lat,data.location_lon]
            },
            latitude: data.location_lat,
            longitude: data.location_lon
        };

        models.SafeUser.create(passed).then(resp => {
            res.json(jsonSuccess({
                db: resp,
                passed: passed,
                send: data
            }));
        })
    } catch(ex){
        console.log(ex);
        res.json(jsonError('Missing parameters' , {...req.body}) );
    }   
});


router.post('/rescue/volunteer/register', function(req,res) {
    let name = req.body.name;
    let phoneNumber = req.body.phoneNumber
    let type = req.body.type;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let info = req.body.info;

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
            info: info
        }
    }).spread((resVol, created) => {
        if (! created) {
            resVol.set('name', name);
            resVol.set('type', type);
            resVol.set('latitude', latitude);
            resVol.set('longitude', longitude);
            resVol.set('info', info);
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

    if (!phoneNumber) {
        return res.json({
            success: false,
            message: "Phone Number is required"
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
            'status': (status)?'ACTIVE':'INACTIVE'
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



module.exports = router;



