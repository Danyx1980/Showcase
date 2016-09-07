var express = require("express");
var router = express.Router();
var Campground = require("../models/picture");
var middleware = require("../middleware");
var fs = require("fs");
var aws = require("aws-sdk"); 

const S3_BUCKET = process.env.S3_BUCKET;

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS
});

var s3 = new aws.S3();

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
                    var fileName = campground.image.substr(campground.image.indexOf(".com/") + 5);
                    var params = {
                        Bucket: S3_BUCKET,
                        Key: fileName
                    };
                    console.log("deleting");
                    s3.deleteObject(params, function(err, data){
                    if(data) {
                        console.log("deleted");
                        console.log(data);
                    } else if (err){
                        console.log("error");
                        console.log(err);
                    }
                    });
                 }
              });
          res.redirect("/pictures");
      }
    });
});

module.exports = router;