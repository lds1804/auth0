"use strict";

module.exports = function (ctx, done) {
  

var timePrevious;
var timeDiffInMinutes;


//Gets the previous time stored in the JSON
// 
try{
ctx.storage.get(function (error, data) {
        
        console.log("Data get:"+data);

        if (error) return cb(error);
          
          var jsonObject = JSON.parse(data);
          timePrevious=jsonObject.timePrevious;
          console.log("Time previous storage get:"+timePrevious);
          timeDiffInMinutes=calculateTime(timePrevious);
          
          sendEmail(timeDiffInMinutes,timePrevious,ctx);
        
        
    });
} catch (exception){
 
          console.log("Exception on getting previues time :"+exception);
    
}


  done(null, 'Price received:, ' + ctx.data.price);
}


//Calculates the time difference from the now and the last request
function calculateTime(timePrevious){
  
  var timeNow;
  var timeDiff;
  var timeDiffInMinutes;
  
  timeNow= Date.now();

  timeDiff = (timeNow - timePrevious);
  

  timeDiffInMinutes = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
  console.log("Time minutes send email:"+timeDiffInMinutes + " timePrevious: " + timePrevious);
  
  return timeDiffInMinutes;
  
}

//Send an email in a 15 minutes time interval

function sendEmail(timeDiffInMinutes,timePrevious,ctx){
  
var previousTimeJson;  
var timeNow= Date.now();  
  
// create reusable transporter object using the default SMTP transport
var api_key = 'key-31f1cd8e1c7c8b2529f2d557fa397750';
var domain = 'sandbox8209faa3c4f0460b9dde4e28bac79f1e.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'BitCoin User <leandro@bitcoin.com>',
  to: 'lds1804@gmail.com',
  subject: 'Bitcoin Price',
  text: 'Hi, Today the Bitcoin price is U$' + ctx.data.price + '!!'
};
  


  
  if(timeDiffInMinutes>15|| !timePrevious) {
  mailgun.messages().send(data, function (error, body) {  console.log(body);});
  
  //Store the current time in the storage
  previousTimeJson='{ "timePrevious":' + timeNow +'}';
  
  
  ctx.storage.get(function (error, previousTimeJson) {
        if (error) return cb(error);
        
        previousTimeJson='{ "timePrevious":' + timeNow +'}';
        console.log("Data get last :"+previousTimeJson);
        
        ctx.storage.set(previousTimeJson,{ force: 1 }, function (error) {
            if (error) return cb(error);
        });
    }); 
}
  
  
  
}





