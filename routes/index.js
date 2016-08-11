var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("index/index");
    //res.redirect("/campgrounds");
});

router.get("/register", middleware.isNotLoggedIn, function(req, res){
    res.render("authentication/authenticate", {login: "", register: "active"});
});

router.post("/register", middleware.isNotLoggedIn, function(req, res){
    
    User.findOne({email: req.body.email}, function(err, user){
    if(err) {
       console.log(err);
    } else {
       if(user){
           res.redirect("/authenticate");
       } else {
           var newUser  = new User(
        {
            username: req.body.username,
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email
        });
    
    User.register(newUser, req.body.password, function(err, username){
        if(err){
            console.log(err);
            res.redirect("/authenticate");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
       }
    }
    });
    
    
});

router.get("/login", middleware.isNotLoggedIn, function(req, res){
   res.render("authentication/authenticate", {login: "active", register: ""}) ;
});

router.post("/login", middleware.isNotLoggedIn, passport.authenticate("local", {
    successRedirect: "",
    failureRedirect: "/login"
}), function(req, res){
    res.redirect("back");
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("back");
})

module.exports = router;