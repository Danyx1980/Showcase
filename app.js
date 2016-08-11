var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongo = require("mongoose"),
    User = require("./models/user"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    picRoutes = require("./routes/pictures"),
    methodOverride = require("method-override"),
    formidable = require("formidable");
    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongo.connect(process.env.DATABASEURL);
// seedDB();

app.use(require("express-session")({
    secret: "I hate nice girls",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    if(req.user){
        User.findById(req.user.id, function(err, user){
            if(err){
                console.log(err);
            } else {
                res.locals.currentUser = user;
            }
        });
    }
    res.locals.searchQuery = "";
    next();
});

app.use(indexRoutes);
app.use("/pictures/:id/comments", commentRoutes);
app.use("/pictures", picRoutes);

// app.get("*", function(req, res){
//   res.redirect("/pictures");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
    
});