var mongo = require("mongoose");

var commentSchema = new mongo.Schema({
    author: {
        id: {
            type: mongo.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }, 
    body: String,
}) ;

var Comment = mongo.model("Comment", commentSchema);

module.exports = Comment;