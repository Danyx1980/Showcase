var express = require("express");
var router = express.Router();
var Campground = require("../models/picture");
var middleware = require("../middleware");
var formidable = require("formidable");
var fs = require("fs");
var aws = require("aws-sdk");

const S3_BUCKET = process.env.S3_BUCKET;

router.get("/", function(req, res){
    if(req.query.searchQuery){
        var query ={};
        if(req.query.filter === "Author"){
            query["author.username"] = {
                "$regex" : req.query.searchQuery,
                "$options" : "i"
            };
        } else {
            query[req.query.filter.toLowerCase()] = {
                "$regex" : req.query.searchQuery,
                "$options" : "i"
            };
        }
        
        Campground.find(query, function(err, pictures){
           if(err) {
               console.log(err);
           } else {
               res.render("pictures/pictures", {pictures : pictures})
           }
        });
    } else {
        Campground.find({}, function(err, allPictures){
            if(err){
                console.log(err);
                res.redirect("/");
            } else {
                res.render("pictures/pictures", {pictures : allPictures});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, function(req, res){
    if(req.body.campground){
        console.log(req.body);
        Campground.create(req.body.campground, function(err, newCamp){
          if (err) {
              console.log(err);
          } else {
              newCamp.author.id = req.user._id;
              newCamp.author.username = req.user.username;
              newCamp.save();
              res.redirect("/pictures");
          }
        });
    } else {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            if(err){
                console.log(err);
            } else {
                if(files.image.type.substring(0, files.image.type.indexOf("/")) === "image"){
                    fs.rename(files.image.path, __dirname.substr(0, __dirname.indexOf("/routes")) + "/public/images/" + files.image.path.substring(files.image.path.indexOf("upload")), function(){
                        var sentCamp = {
                        name: fields.name,
                        description: fields.description,
                        image: "/images/" + files.image.path.substring(files.image.path.indexOf("upload"))
                        };
                        console.log(sentCamp.image);
                        console.log(files.image.path);
                        Campground.create(sentCamp, function(err, newCamp){
                            if (err) {
                                console.log(err);
                            } else {
                              newCamp.author.id = req.user._id;
                              newCamp.author.username = req.user.username;
                              newCamp.save();
                              res.redirect("/pictures");
                            }
                        }); 
                    });
                } else {
                    res.redirect("pictures/new");
                }
            }
        });
    }
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("pictures/new");
});

router.get("/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
           res.render("pictures/show", {campground : campground});
       }
   }); 
});

router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err) {
          console.log(err);
      } else {
          console.log(campground);
          res.render("pictures/edit", {campground: campground});
      }
   });
});

router.put("/:id",middleware.checkCampOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/pictures");
       } else {
           //redirect somewhere(show page)
           res.redirect("/pictures/" + req.params.id);
       }
    });
});

router.delete("/:id", middleware.checkCampOwnership, function(req, res){
    
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
      if(err) {
          console.log(err);
      } else {
          fs.unlink( __dirname.substr(0, __dirname.indexOf("/routes")) + "/public" + campground.image, function(err){
             if(err){
                 console.log(err);
             }
          });
          res.redirect("/pictures");
      }
    });
});

router.get("/sign-s3", (req, res) => {
   const s3 = new aws.S3();
   const fileName = req.query["file-name"];
   const fileType = req.query["file-type"];
   
   const s3Params = {
       Bucket: S3_BUCKET,
       Key: fileName, 
       Expires: 60, 
       ContentType: fileType, 
       ACL: "public-read"
   };
   
   s3.getSignedUrl("putObject", s3Params, (err, data) => {
       if(err){
           console.log(err);
           return res.end(); 
       }
       
       const returnData = {
           signedRequest: data, 
           url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}` 
       };
       res.write(JSON.stringify(returnData));
       res.end();
   });
});

module.exports = router;