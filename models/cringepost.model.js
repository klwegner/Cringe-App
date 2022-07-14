const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pictureSchema = new Schema (
{
  title: String, 
  imageUrl: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'}
}, 
{
    timestamps: true
}
);

const Post = model('Cringepost', pictureSchema);

module.exports = Post;
