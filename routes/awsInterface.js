var express = require("express");
var router = express.Router();
var aws = require("aws-sdk");
var uuid  = require("node-uuid");

var S3_BUCKET = process.env.S3_BUCKET;

router.get("/sign-s3", function(req, res) {
   const s3 = new aws.S3();
   const fileName = req.query["file-name"];
   const fileType = req.query["file-type"];
   
   var id = uuid.v1();
   
   const s3Params = {
       Bucket: S3_BUCKET,
       Key: id, 
       Expires: 60, 
       ContentType: fileType, 
       ACL: "public-read"
   };
   console.log(s3Params);
   
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
        console.log("error on sign-s3");
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${id}`
    };
    
    console.log(returnData);
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;