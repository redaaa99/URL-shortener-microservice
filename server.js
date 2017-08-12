// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var databaseUrl = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

var MongoClient = mongodb.MongoClient;

function findThisUrl(url,db)
{
  db.collection('urls').findOne({"redirectTo": url}).then(function(result){
    return result;
  });
}

app.use(express.static('public'));

MongoClient.connect(databaseUrl, function (err, db){
  if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    
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
          var obj = db.collection('urls').findOne({"redirectTo": url}).then(function(obj){
            if(!(obj===null))
            {
               response.json({
                  original_url : url,
                  short_url : "https://url-shortener-microservice-redaaa.glitch.me/"+obj.id
                });

            }
          else
            {
              var newId = (Math.floor((Math.random() * 10000) + 2)).toString();
              db.collection('urls').insertOne({
                "id": newId,
                "redirectTo" : url
              }).then(function(obj){
                response.json({
                  original_url : url,
                  short_url : "https://url-shortener-microservice-redaaa.glitch.me/"+newId
                });
              });
            }
          });
        }
      else
        {
          response.json({error : "Wrong url format, make sure you have a valid protocol and real site."});
        }
    }); 

  db.close();
  }
});
                    






// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
