// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var databaseUrl = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var options = { keepAlive: 300000, connectTimeoutMS: 30000 }

function findThisUrl(url,db,response,callback)
{
  db.collection('urls').findOne({"redirectTo": url},function(err,result){
    if(err){throw err;}
    console.log(result);
    if(result)
      {
        response.json({
                  original_url : url,
                  short_url : "https://url-shortener-microservice-redaaa.glitch.me/"+result.id
                });
      }
    else/* NOT FOUND THEN INSERT*/
      {
          var newId = (Math.floor((Math.random() * 10000) + 2)).toString();
          var obj = {
            "id": newId,
            "redirectTo" : url
          };
        
         db.collection('urls').save(obj, function(err, result) {
           if (err) throw err;
          
           response.json({
                      original_url : url,
                      short_url : "https://url-shortener-microservice-redaaa.glitch.me/"+newId
                    }); 
         });
        /*db.collection('urls').insertOne({
                "id": newId,
                "redirectTo" : url
              }).then(function(result){
             
        });*/
      }
    callback(result);
  });

  
}

app.use(express.static('public'));
var db;
mongodb.MongoClient.connect(databaseUrl,options,function (err, db){
  if (err) console.log('Unable to connect to the mongoDB server.');
  app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
  app.get("/:id(\\d+)", function (request, response) {
var id =request.params.id;
/*
if id exists in database redirect to website;
else response.json({error : "Cannot find this URL in database"});
*/
response.send(id);
});    
  app.get(/^\/(.+)/, function (request, response) {
var url = request.params["0"].toString();
var reg =/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
if(reg.test(url))
{

  findThisUrl(url,db,response,function() {
    db.close();
  });
}
else
{
  response.json({error : "Wrong url format, make sure you have a valid protocol and real site."});
}
}); 
  app.listen(process.env.PORT);

    
});
                    






