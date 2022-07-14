const User = require("../models/User.model");
const CringePost = require("../models/cringepost.model");
const mongoose = require("mongoose");
const router = require("express").Router();

router.post("post/:postid/like", (req, res) => {
  const { id } = req.params;
  CringePost.findByIdAndUpdate(id, { $push: { likes: id } }, { new: true })
    .then((numOfLikes) => {
      CringePost.findByIdAndUpdate(id, { $inc: { likedMe: 1 } }, { new: true })
        .then((totalLikes) => {
          res.json({ success: true, totalLikes });
        })
        .catch((err) => {
          console.log(err);
          res.json({ success: false });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

router.post("post/:postid/unlike", (req, res) => {
    const { id } = req.params;
    CringePost.findByIdAndUpdate(id, { $pull: { likes: id } }, { new: true })
      .then((numOfLikes) => {
        CringePost.findByIdAndUpdate(id, { $inc: { likedMe: -1 } }, { new: true })
          .then((totalLikes) => {
            res.json({ success: true, totalLikes: totalLikes });
          })
          .catch((err) => {
            console.log(err);
            res.json({ success: false });
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: false });
      });
  });
  