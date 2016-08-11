var mongo = require("mongoose");

var picSchema = new mongo.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
            {
                type: mongo.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
    author: {
        id: {
            type: mongo.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var Picture = mongo.model("Picture", picSchema);

module.exports = Picture;