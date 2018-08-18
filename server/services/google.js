
var {google} = require('googleapis');
module.exports =  function() {
    return new Promise((resolve,reject)=>{
        var sheetId = "1yw6htVgozlLDjJXNFaDt9m3ahmJGvwWZfyq1AnYgJJ8";
        var privatekey = require('../config/cred.json');
        var jwtClient = new google.auth.JWT(
            privatekey.client_email,
            null,
            privatekey.private_key,
            [
                'https://www.googleapis.com/auth/spreadsheets',
            ]
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                return reject(err);
            } 
            resolve(jwtClient);
        });
    });
    
}