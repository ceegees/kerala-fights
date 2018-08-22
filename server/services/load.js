const fs = require('fs');
const models = require('../models');
const distrctMap = require('../config/data').districtMap;
const moment = require('moment');
const request =require('request');
const cheerio = require('cheerio');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(require('../config/config'));


function getContent(url)  { 
    return new Promise((resolve,reject) => { 
        request({
            url: url,
            time: true
        }, function (error, response, body) {
            if (error){
                return reject(err);
            }
            resolve(body); 
        }); 
    });
}

async function loadData(offset=0){

    const content  = await getContent(`https://www.keralarescue.in/data/?offset=${offset}`);
    const parsed = JSON.parse(content); 
    // console.log(parsed);
    const source = 'www.keralarescue.in';
    let maxId = 0;
    if (parsed.data.length == 0){
        console.log('Processin Complete');
        process.exit();
        return;
    }
    for(var idx = 0;idx < parsed.data.length;idx++){
        const data = parsed.data[idx];

        let row = await models.HelpRequest.findOne({
            where:{
                remoteId:data.id,
                source:source,
            }
        });
        if (maxId < data.id){
            maxId = data.id;
        }

        const cords = data.latlng.split(",");
        let geoJson = null;
        let location = null;

        if (!isNaN(cords[0]) && !isNaN(cords[1])  && cords.length == 2 ){
            geoJson =  {
                type:'Point',
                coordinates:[
                    parseFloat(cords[0]),
                    parseFloat(cords[1])
                ]
            };
            location = {
                lat:parseFloat(cords[0]),
                lon:parseFloat(cords[1])
            };
        }

        const tags = [];
        if (data.needwater){
            tags.push('Need Water');
        }

        if(data.needfood){
            tags.push("Need Food");
        }

        if(data.needcloth){
            tags.push("Need Cloth");
        }

        if(data.needmed){
            tags.push("Need Medicine");
        }

        if (data.needtoilet){
            tags.push("Need Toiletry");
        }

        if (data.is_request_for_others){
            tags.push("Requesting for someone else");
            geoJson = null;
            location = null;
        }

        if (data.needkit_util){
            tags.push("Need Kit");
        }

        if(data.needrescue){
            tags.push("Needs Evacuation");
        }
        let json = {}
        if (!row){
            row =  await models.HelpRequest.create({
                remoteId: data.id,
                source:source,
                status:data.status.toUpperCase(),
                type:'rescue_request'
            });
        } else {
            json = row.json;
        }

        if (row.status == 'NEW'){
            row.status = data.status.toUpperCase();
        }   
 
        row.remoteId=  data.id;
        row.source  = source;
        row.type = 'rescue_request';
        row.district = distrctMap[data.district.substring(0,255)];
        row.location = data.location.substring(0,255);
        row.personName = data.requestee.substring(0,255);
        row.address = data.location;
        row.phoneNumber = data.requestee_phone;
        row.latLng = geoJson;
        
        const keys = [
            "\nWater:" , 
             "\nFood:" , 
             "\nCloth:" , 
             "\nMedicine:", 
             "\nToiletry:", 
             "\nKit:", 
             "\nRescue:", 
        ];

        const list = [
            data.detailwater,
            data.detailfood,
            data.detailcloth,
            data.detailmed,
            data.detailtoilet,
            data.detailkit_util,
            data.detailrescue
       ];
        const texts = list.map( (item,idx) => item != "" ?(keys[idx]+":"+item ):"" );

        row.information = data.needothers +"\n" + texts.join('');
        row.createdAt = moment(data.dateadded);
        row.json =  Object.assign(json, {
            location:location,
            info :data,
            tags :tags
        });
        const updated =  await row.save(); 
    }
    console.log('Done total',maxId);
    setTimeout(function(){
        loadData(maxId);
    },1000)
}

async function clearLocks(){
    models.HelpRequest.update({
        operatorId:null,
        operatorLockAt:null
    },{
        where:{
            operatorLockAt:{
              [Sequelize.Op.lt] : moment().subtract(15,'minutes')
            }
        }
    }).then(res => {
        console.log(res);
        process.exit();
    }).catch(ex => {
        console.log(ex);
        process.exit();
    })
}
 
async function deDupe(){
    const list = await sequelize.query(`SELECT 
        phone_number,
        count(*) as total_requests ,
        min(created_at) as min_created , 
        min(remote_id) as min_remote
    FROM 
        help_requests  
    GROUP BY 
        phone_number 
    HAVING
        count(*) > 1
    ORDER BY
        total_requests DESC 
    LIMIT 100000`,{  
        plain: false,
        raw: false,
        type: Sequelize.QueryTypes.SELECT
    });

    for(var idx =0;idx < list.length;idx++){
        const data = list[idx]; 
        const row = await models.HelpRequest.findOne({
            where : {
                remoteId: data.min_remote
            }
        });
        console.log(data.phone_number,row.id);
        let qry = `UPDATE help_requests 
        SET parent_id=${row.id} WHERE parent_id=null  AND id != ${row.id} AND phone_number = :phone_number;`;
        console.log(qry);
        let res = await sequelize.query(qry,{
            replacements:{
                phone_number:data.phone_number
            },
            plain: false,
            raw: false,
        });

        qry = `UPDATE help_requests 
        SET status='PHONE_DUPLICATE' WHERE 
        status='NEW' AND phone_number = :phone_number AND id != ${row.id};`;
        console.log(qry);
        res = await sequelize.query(qry,{
            replacements:{
                phone_number:data.phone_number

            },
            plain: false,
            raw: false,
        });
        row.parent_id = null;
        row.json.duplicateCount = data.total_requests; 
        const saved = await row.save();
     }
     console.log('Completed updateing duplicates');
    qry = `UPDATE help_requests  SET parent_id=NULL WHERE id=parent_id`;
    console.log(qry);
    res = await sequelize.query(qry,{
        plain: false,
        raw: false,
    });
     process.exit();
}

function loadFromHTML(page = 1){
    if (page < 1){
        process.exit();
        return;
    } 
    console.log('Loading from page:',page);
    getContent(`https://www.keralarescue.in/requests/?page=${page}&district=`)
    .then(resp=>{
        handleContent(resp,page);
    });
}
console.log(process.argv);
if (process.argv.length > 2 ){
    option = process.argv[2];
    if (option == 'data'){
        if (process.argv.length > 3){
            loadData(process.argv[3]);
        } else {
            models.HelpRequest.max('remoteId', { 
                where: { source: 'www.keralarescue.in' } 
            }).then(max => {
                console.log('loading from max id ',max);
                loadData(max);
            })
        }
    } else if (option == 'html'){
        loadFromHTML(process.argv[3]);
    } else if (option == 'dedup'){
        deDupe();
    } else if (option == 'clear_locks'){
        clearLocks();
    }
} else {
    console.log('Missing options [data  | html endpage | sheet]');
}
