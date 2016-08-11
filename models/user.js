var mongo = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongo.Schema({
    username: String,
    password: String,
    name: String,
    lastName: String, 
    email: String
});

userSchema.plugin(passportLocalMongoose);

var userModel = mongo.model("User", userSchema);

module.exports = userModel;