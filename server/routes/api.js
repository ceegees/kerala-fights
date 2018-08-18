const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const service = require('../services/google.js');
const models = require('../models');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(require('../config/config'));
const {statusList} = require('../config/data');
const Op = Sequelize.Op;
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

    const sheetId = "1MbCBl5AYs3PgdPcrIz6nFR98y3acUIa73Ba_Wh2EmEc";
    const sheetName = `${req.query.mon}!A1:J1000`
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
    

    

    models.WorkLog.findAll({
        where:{
            requestId:req.query.id
        },
        order:[
            ['createdAt','DESC']
        ],
        include :[
            { model: models.User ,as:'actor' },
        ]
    }).then(list =>{
        res.json(jsonSuccess(list));
    }).catch(ex => {
        console.log(ex);
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
        }) ;
    }).then(workLog=>{
        console.log(currentMove);
        rescue.status = currentMove.target.toUpperCase();
        rescue.operatorStatus = status;
        rescue.operatorSeverity = severity;
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
    if (req.query.q){
        const parts = req.query.q.split('-');
        const ors = {
            phoneNumber:{
                [Op.like]:`${req.query.q}%`
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
        }
        whereQuery = {
           [Op.or] :ors
        }
        params.page = 1;
    } else {
        if (!state){
            res.json(jsonError("Invalid status"));
        }
        whereQuery = {
            status: {
                [Op.in]:state.db
            }
        };
    }

    if (req.query.location){
        whereQuery = {
            status:'NEW',
            latLng: {
                [Op.ne] :null
            }
        }
    }

    models.HelpRequest.findAll({
        where:whereQuery,
        order:[
            ['createdAt','DESC']
        ],
        offset:(params.page -1)*params.per_page,
        limit:params.per_page

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
module.exports = router;



