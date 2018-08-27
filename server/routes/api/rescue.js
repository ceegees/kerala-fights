
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Sequelize = require('sequelize');

const {jsonError,jsonSuccess,filterFromQuery} = require('./../../services/utils'); 

const models = require('./../../models');

const config  = require('./../../config/data');
const sequelize = new Sequelize(require('./../../config/config'));
const Op = Sequelize.Op;
const {statusList} = config;


function lockRequest(req,res){
    let request = null;
    models.HelpRequest.find({
        where:{id:(req.query.id || req.body.id)},
        include :[ { 
            model: models.User ,as:'operator' 
        }]
    }).then(item => {
        if (!item){
            throw new Error("Invalid id");
        }
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

        if(req.user){
            // models.workLog.create({
            //     requestId:request.id,
            //     actorId:req.user.id,
            //     statusIn:request.status,
            //     statusOut:request.status,
            //     message:'Viwed'
            // });
        }

    }).catch(ex => {
        console.log(ex);
        res.json(jsonError(ex.message));
    })
}

router.post('/lock',lockRequest);

router.post('/release-lock',function(req,res){
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
});

router.post('/update',function(req,res){
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

router.get('/list',function(req,res){    
    const params = filterFromQuery(req.query,{status:''})
    params.status = params.status.toLowerCase();
    const state = statusList.find(i => i.key == params.status);
    let whereQuery = {};
    let limitResult = false;

    if (params.status && params.status.indexOf("duplicates:") >= 0) {
        var id =  params.status.replace("duplicates:",'');
        whereQuery = {
            [Op.or] : {
                parentId:id,
                id:id
            },    
        };
    } else if (params.status == 'duplicates'){ 
            whereQuery = { 
                parentId:{
                    [Op.ne] :null
                },
                status:{
                    [Op.ne]:'RESOLVED'
                } 
            }  
        
    } else if (req.query.q){
        const query = req.query.q.toLowerCase();
        let ors = {}
        const parts = query.split('-');

        if (query.indexOf("id:") > -1){
            ors.id = query.replace("id:","");
        } else if (query.indexOf('kr:') > -1) {
            ors.remoteId = query.replace('kr:','');
        } else if (query.indexOf("info:") > -1) {
            const info = query.replace("info:","");
            ors.information = {
                [Op.iLike]: `%${info}%`
            }
            ors.address = {
                [Op.iLike]: `%${info}%`
            }
        } else if(query.indexOf('src:') > -1 ) {
            ors.source = {
                [Op.iLike]: `%${query.replace('src:','')}%`
            }
        } else {
            ors.phoneNumber = {
                [Op.iLike]: `${query}%`
            };
            ors.personName = {
                [Op.iLike]:`${query}%`
            };
            ors.id = parts[0];
            ors.parentId = parts[0];
            ors.remoteId = parts[0];
        }
 
        ['id','parentId','remoteId'].forEach(name => {
            if (isNaN(ors[name]) || ors[name].length > 8) {
                delete(ors[name]);
            }
        })

        whereQuery = {
           [Op.or] :ors
        }  
    }

    if (req.query.location){ 
        limitResult = true;
        whereQuery.latLng = {
            [Op.ne] :null
        }
    }

    if (req.query.severity && req.query.severity.length < 8){
        whereQuery.operatorSeverity = req.query.severity;
    }
    
    if (state){
        whereQuery.status = state.db;
        limitResult = true;
    }

    if (req.query.requestType){
        whereQuery.type = req.query.requestType;
    }

    if (req.query.district){
        whereQuery.district = req.query.district;
    }

    if (req.query.startAt && req.query.endAt){
        whereQuery.createdAt = {
            [Op.between] : [
                moment.unix(req.query.endAt/1000).toDate(),
                moment.unix(req.query.startAt/1000).toDate()
            ]
        }
    } else if (limitResult){
        whereQuery.createdAt = {
            [Op.between] : [
                moment().subtract(5,'days').toDate(),
                new Date()
            ]
        }
    }

    const result = {
        total:0,
        demand:0,
        page:params.page,
        per_page:params.per_page,
    }

    let sortOptions = [ 
        ['operatorLockAt','DESC NULLS FIRST'],
        ['operatorUpdatedAt','DESC NULLS FIRST'],
        ['createdAt','DESC']
    ];

    if (req.query.sortOn == 'demand'){
        sortOptions = [ 
            ['peopleCount','DESC NULLS LAST'],
        ];
    } else if (req.query.sortOn == 'oldest') {
        sortOptions = [ 
            ['createdAt','ASC'],
        ];
    } else if (req.query.sortOn == 'demand_desc'){
        sortOptions = [ 
            ['peopleCount','DESC NULLS FIRST'],
            ['createdAt','ASC'],
        ];
    }

    models.HelpRequest.findAll({
        where:whereQuery,
        order:sortOptions,
        offset:(params.page -1)*params.per_page,
        limit:params.per_page,
        include :[ { 
            model: models.User ,as:'operator' 
        }]
    }).then(list => {
        result.list = list;
        return models.HelpRequest.count({
            where:whereQuery,
        });
    }).then(count => {
        result.total = count;
        result.page_max = Math.floor( count /params.per_page);
        return models.HelpRequest.sum('people_count',{
            where:whereQuery,
        });
    }).then(total => {
        result.demand = total; 
        res.json(jsonSuccess(
            result
        ));
    }).catch(ex => {
        res.json(jsonError(ex.message))
    })
});

router.post('/add',function(req,res){ 
    try {
        const data = req.body;        
        const passed = {
            phoneNumber:data.phone_number,
            personName : data.name,
            district: data.district,
            type : data.help_type,
            location:data.location,
            peopleCount:data.member_count,
            address:data.address +"\n"+ ((data.alternate_numbers)?data.alternate_numbers:''),
            powerBackup:data.power_backup,
            information:data.member_details,
            remoteId:data.remoteId || null, 
            refId:data.refId || null,
            source:data.source || 'keralafights',
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
            res.json(jsonSuccess(resp,'A new case Id - '+ resp.id + ' is generated for you.  Please use this for any future reference '));
        })
    }catch(ex){
        console.log(ex);
        res.json(jsonError('Missing parameters' , {...req.body}) );
    }
        
});

router.get('/substatus',function(req,res){
    sequelize.query("select status,operator_status ,count(*) from help_requests group by status,operator_status order BY status,operator_status",{
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT
    }).then(list => {
        res.json(list);
    })
})

router.get('/duplicates',function(req,res){
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

router.get('/status',function(req,res){
    sequelize.query("SELECT count(*) as total, status from help_requests group by status order by total desc",{  
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

router.post('/edit',function(req,res){
    
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
        rescue.peopleCount = data.peopleCount;
        if (data.type){
            rescue.type = data.type;
        }
        rescue.latLng = {
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
        rescue.json = JSON.parse(JSON.stringify(rescue.json));
        return rescue.save();
    }).then(data => {
        res.json(jsonSuccess(data));
    }).catch(ex =>{
        console.log(ex);
        res.json(jsonError(ex.message));
    });
      
});

module.exports = router;