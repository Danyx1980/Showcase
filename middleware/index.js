var Campground = require("../models/picture");
var User = require("../models/user");
var Comment = require("../models/comment");

var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

middleware.isNotLoggedIn =function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/");
    }
}

middleware.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                console.log(err);
            } else {
                if(campground.author.id.equals(req.user._id)){
                   return next();
                } else {
                    console.log("back"); 
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
           if(err) {
               
           } else {
               if(comment.author.id && comment.author.id.equals(req.user._id)){
                   return next();
               } else {
                   res.redirect("back");
               }
           }
        });
    }
}

module.exports = middleware;