var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: String,
    body: {
        type: String,
        minlength: 6
    }
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;