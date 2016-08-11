var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    Campground = require("../models/picture"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/pictures/" + req.params.id);
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  
                  console.log(err);
                  
              } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/pictures/" + req.params.id);
              }
           });
       }
   }); 
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    console.log(err);
                }
                res.render("pictures/edit", {comment: comment, campground: campground});  
            })
        }
    })
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
      if(err) {
          console.log(err);
      } else {
          res.redirect("/pictures/" + req.params.id);
      }
   });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
       if(err){
           console.log(err);
       } else {
           res.redirect("/pictures/" + req.params.id);
       }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;