"use strict";

module.exports = function (ctx, done) {
  
var sendEmail;
var timePrevious;
var timeNow;
var timeDiff;
var timeDiffInMinutes;
var previousTimeJson;

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

//Gets the previous time stored in the JSON
// 
try{
ctx.storage.get(function (error, data) {
        
        if(data){
          
          var jsonObject = JSON.parse(data);
          timePrevious=jsonObject.timePrevious;
          console.log("Time previous storage get:"+timePrevious);
        }
        
    });
} catch (exception){
 
          console.log("Exception on getting previues time :"+exception);
    
}


timeNow= Date.now();

timeDiff = (timeNow - timePrevious);
console.log("Time minutes send email:"+timeNow + " timePrevious: " + timePrevious);

timeDiffInMinutes = Math.round(((timeDiff % 86400000) % 3600000) / 60000);

if(timeDiffInMinutes>60 || !timePrevious){
  sendEmail=true;
  console.log("Time minutes send email true:"+timePrevious);
}
else{
  sendEmail=false;
  console.log("Time minutes send email false:" + timePrevious);
}



 
if(sendEmail) {
  //Send email
  mailgun.messages().send(data, function (error, body) {  console.log(body);});
  
  //Store the current time in the storage
  previousTimeJson='{ "timePrevious":' + timeNow +'}';
  
  try{
  ctx.storage.set(previousTimeJson, function (error) {
            if (error) return cb(error);
            
        });

  }
  catch(exception){
    console.log("Exception on getting previues time :"+exception);
     
  }
  
  
}
  
  done(null, 'Price received:, ' + ctx.data.price);
}





