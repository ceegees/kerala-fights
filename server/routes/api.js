const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const service = require('../services/google.js');
const models = require('../models');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(require('../config/config'));
const config  = require('../config/data'); 
router.get('/config',function(req,res){
    res.json(jsonSuccess(config));
})

const {jsonError,jsonSuccess,filterFromQuery} = require('../services/utils');
const Op = Sequelize.Op;
const moment = require('moment');

router.get('/auth-user',function(req,res){
    res.json(jsonSuccess(req.user)); 
});

router.get('/message', function (req, res, next) {
    res.json({ title: 'Ceegees' });
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

router.get('/sync',async(req,res) => {

    //const sheetId = "1eXLEA4UW2Eq4KKcCv_9scHL_xDj0fadLd3VxyqCYu94";
    const sheetId = "1xyCnukvtSEeIFBzMhvxtnFVivFNEx7v06Q67MW8Zbnc";
    const sheetName = `${req.query.mon}!A1:J1000`
    const sheets = google.sheets('v4');

    let colMaps = {
        "Sl.no": "remoteId",
        "Sl.no.": "remoteId",
        "Time Stamp": "createdAt",
        "Time Stamps": "createdAt",
        "Name | പേര് ": "personName",
        "Name | പേര്": "personName",
        "Contact no. | നമ്പര്‍": "phoneNumber",
        "Volunteer Name": "volunteer",
        "volunteer Name": "volunteer",
        "Volnteer Name": "volunteer",
        "Volunteer name": "volunteer",
        "Co-ordinates (if available)": "latLng",
        "Location | സ്ഥലം": "location",
        "Status | അവസ്ഥ": "status",
        "No. of people | ആളെണ്ണം": "peopleCount",
        "Degree of emergency | തീവ്രത": "operatorSeverity",
        "Current Status ": "currentStatus",
        "Current Status": "currentStatus",
        "Help required": "requireHelp",
        "Call Status": "callStatus",
        "Rescue Required": "requireRescue",
        "Rescue reqd.": "requireRescue"
    };
    
    try {
        let client = await service();
        let response = await sheets.spreadsheets.get({
            auth: client,
            spreadsheetId: sheetId
        });

        let data = [];
        if(response.data.sheets) {
            
            for(var i = 0; i < response.data.sheets.length; i++) {
                let _sheet = response.data.sheets[i];
                let resp  = await sheets.spreadsheets.values.get({
                    auth: client,
                    spreadsheetId: sheetId,
                    range: `${_sheet.properties.title}!A1:Z3000`
                });
                
                //iterate over the rows and identify the header row
                if(resp.data.values) {
                    let values = resp.data.values;
                    let headerIdx = values[0][0] && values[0][0].toLowerCase().replace('.', '') === 'slno' ? 0 : 1
                    let colsList = [];
                    values[headerIdx].forEach(col=>{
                        if(col.trim() === '') { 
                            //ALAPPUZHA DISTRICT dont have the Sl.no header column
                            return; 
                        }
                        //check if the column mapping is already defined
                        if(!colMaps[col]) {
                            console.log("Unmapped column found", col);
                        }
                        if(colsList.indexOf(col) <= -1) {
                            colsList.push(col);
                        }
                    });

                    //assign row data
                    let rows = [];
                    for(var rIdx = headerIdx+1; rIdx < values.length; rIdx++) {
                        let row  = {};
                        values[rIdx].forEach((val, cIdx)=>{
                            val = val.trim();
                            let colName = colMaps[colsList[cIdx]] || colsList[cIdx];
                            //if colName not found and value is valid, set a random colName
                            if(!colName && val !== '') {
                                colName = `unknown-${cIdx}`;
                            }
                            row[colName] = val;
                        });
                        rows.push(row);
                    }

                    //set the data specific to one particular sheet
                    data.push({sheet: _sheet.properties.title, data: rows, range:  resp.data.range});
                }
            }
        }
  
        /*const header = response.data.values.shift();
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
        },[]);*/
        res.json(data);
    
    } catch(err) {
        console.log("Error",err);
        res.json(err);
    }
});

router.get('/my-activity',function(req,res){
    models.WorkLog.findAll({
        where:{
            actorId:req.user.id
        },
        order:[
            ['createdAt','DESC']
        ]
    }).then(list => {
        res.json(jsonSuccess(list));
    })
});

router.get('/angels',function(req,res){
    sequelize.query(`SELECT
    users.name as name,
    users.profile_link as picture,
    Res.total as total  FROM
    (
        SELECT 
            actor_id, count(*) as total  
        FROM 
            work_logs 
        GROUP BY
            actor_id 
        ORDER BY 
            total DESC limit 10
    ) Res
    INNER JOIN users ON users.id = Res.actor_id
    ORDER BY Res.total DESC;`, {
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT
    }).then(list => {
        res.json(list);
    })
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
            longitude: data.location_lon,
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
module.exports = router;
