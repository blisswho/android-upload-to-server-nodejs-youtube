var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');

const Youtube = require("youtube-api")
    , fs = require("fs")
    , readJson = require("r-json")
    , Logger = require("bug-killer")
    , prettyBytes = require("pretty-bytes")
    ;

  const CREDENTIALS = readJson(`${__dirname}/credentials.json`);

module.exports = function(app) {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

   app.post('/youtube', function(req, res) {

     if(req.body.auth_code && req.body.file_name){

     let oauth = Youtube.authenticate({
         type: "oauth"
       , client_id: CREDENTIALS.web.client_id
       , client_secret: CREDENTIALS.web.client_secret
       , redirect_url: CREDENTIALS.web.redirect_uris[0]
     });

    //  var android_authcode = '4/mQaQNrv0RhEx4SCKfSm2Ckw8kh99itOWsT1Jacwv6Bk';
        var android_authcode = req.body.auth_code;
        var videofile_name = req.body.file_name;
        var uploadSucceed = false;

     oauth.getToken(android_authcode, (err, tokens) => {

         if (err) {
            res.json({ error: true, message: "Please Check Log for Details" });
            // why does the status not work here? srsly wtf
            res.status(404).end();
             return Logger.log(err);
         }

         Logger.log("Got the tokens.");
         Logger.log(tokens);

         oauth.setCredentials(tokens);

         var req = Youtube.videos.insert({
             resource: {
                 // Video title and description
                 snippet: {
                     title: "Testing SOME BULLGKERR"
                   , description: "Test video upload via YouTube API"
                 }
                 // I don't want to spam my subscribers
               , status: {
                     privacyStatus: "private"
                 }
             }
             // This is for the callback function
           , part: "snippet,status"

             // Create the readable stream to upload the video
           , media: {
             //${__dirname} maybe use this?
                 body: fs.createReadStream("./uploads/"+videofile_name)
             }
         }, (err, data) => {
             uploadSucceed = true;
             console.log("Done.");
             process.exit();
         });

         setInterval(function () {
             Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
         }, 250);
     });

    if(uploadSucceed){
        res.json({ error: false, message: 'Upload Completed Successfully' });
        res.status(200).end();
    }


    }else{
      res.json({ error: true, message: 'Missing Auth Code or FileName' });
      res.status(400).end();
    }

   });

}
