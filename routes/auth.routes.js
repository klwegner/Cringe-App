

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const serveFavicon = require("serve-favicon");
const UserModel = require("../models/User.model");
const saltRounds = 10;
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const fileUploader = require("../config/cloudinary.config");

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {

    const { username, email, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
        console.log(`Password hash: ${hashedPassword}`);
        UserModel.create({
            email,
            passwordHash: hashedPassword,
        });
    })
    .then((createdUser) => {
        console.log('newly created user', createdUser);
        res.redirect('/profile')
    })
    .catch((error) => next(error));
});

router.get('/profile', isLoggedIn, (req, res) => {
  User.findById(req.session.currentUser._id)
  .populate('cringeArray')
    .then((myUser) => {
      console.log(myUser);
      console.log(myUser.cringeArray.length);
        let numOfPosts = myUser.cringeArray.length;
        let cringeLevel ='&#128118; Cringe Kid &#128556;'
        console.log(numOfPosts);
        if (numOfPosts > 4) {
            cringeLevel = '&#128124; Kinda Cringe &#128556;'
        }
        if (numOfPosts > 10) {
          cringeLevel ='&#128130; Captain Cringe &#128556;'
        }
        if (numOfPosts > 20) {
          cringeLevel = '&#127863; Cringe Conisseur &#128556;'
        }
        else if (numOfPosts > 30) {
            cringeLevel = '&#128081; King of Cringe &#128556;'
        }

      res.render('users/user-profile', { userInSession: myUser, cringeLevel });
    })
    .catch((err) => res.send(err));
})



router.get('/profile/edit', isLoggedIn, (req, res) => {
res.render('edit-profile.hbs', {userInSession: req.session.currentUser})
})

// router.post('/profile/edit', isLoggedIn, (req, res) => {
// User.findByIdAndUpdate(req.session.currentUser._id, {about: req.body.about}, {new: true})
// .then((updatedUser) =>{
//   req.session.currentUser = updatedUser;
//   res.redirect('/profile')
// })
// .catch(error => console.log(`Error while updating profile: ${error}`));
// })


  
  router.post('/profile/edit', isLoggedIn, fileUploader.single("profileImage"), (req, res) => {
  let myProfileImage;
  console.log(req.file, req.session);
  if(req.file && req.file.path){
    myProfileImage = req.file.path
  } else {
    myProfileImage = req.session.currentUser.profileImage
  }
  User.findByIdAndUpdate(req.session.currentUser._id, {about: req.body.about, profileImage: myProfileImage}, {new: true})
  .then((updatedUser) =>{
    req.session.currentUser = updatedUser;
    res.redirect('/profile')
  })
  .catch(error => console.log(`Error while updating profile: ${error}`));
  })
  
  router.get('/profile', isLoggedIn, (req, res) => {
    User.findById(req.session.currentUser._id)
    .populate('cringeArray')
      .then((myUser) => {
        console.log(myUser);
        console.log(myUser.cringeArray.length);
          let numOfPosts = myUser.cringeArray.length;
          let cringeLevel ='&#128118; Cringe Kid &#128556;'
          console.log(numOfPosts);
          if (numOfPosts > 4) {
              cringeLevel = '&#128124; Kinda Cringe &#128556;'
          }
          if (numOfPosts > 10) {
            cringeLevel ='&#128130; Captain Cringe &#128556;'
          }
          if (numOfPosts > 20) {
            cringeLevel = '&#127863; Cringe Conisseur &#128556;'
          }
          else if (numOfPosts > 30) {
              cringeLevel = '&#128081; King of Cringe &#128556;'
          }
  
        res.render('users/user-profile', { userInSession: myUser, cringeLevel });
      })
      .catch((err) => res.send(err));
  })



  router.get('/post/profile/:userId', (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    User.findById(userId)
    .populate('cringeArray')
    .then((result)=>{
      console.log('hello', result.cringeArray);
      let numOfPosts = result.cringeArray.length;
      let cringeLevel ='&#128118; Cringe Kid &#128556;'
      console.log(cringeLevel);
      if (numOfPosts > 4) {
          cringeLevel = '&#128124; Kinda Cringe &#128556;'
      }
      if (numOfPosts > 10) {
        cringeLevel ='&#128130; Captain Cringe &#128556;'
      }
      if (numOfPosts > 20) {
        cringeLevel = '&#127863; Cringe Conisseur &#128556;'
      }
      else if (numOfPosts > 30) {
          cringeLevel = '&#128081; King of Cringe &#128556;'
      }
      res.render('users/other-user-profile.hbs', { cringeLevel: cringeLevel, profile: result });
  })
    .catch((err) => res.send(err));
  })



//original works
// router.get('/post/profile/:userId', (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);
//   console.log('it worked!')
//   User.findById(userId)
//   .then((result)=>{
//     console.log(result)
//     res.render('users/other-user-profile.hbs', result)
// })
//   .catch((err) => res.send(err));
// })



router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both email and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;



