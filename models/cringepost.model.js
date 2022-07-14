const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pictureSchema = new Schema (
{
  title: String, 
  imageUrl: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
likes: [{
  type: Schema.Types.ObjectId, ref:'User'}],
likedMe: {
  type: Number,
  default: 0,
}
},
{
    timestamps: true
}
);

const Post = model('Cringepost', pictureSchema);

module.exports = Post;
