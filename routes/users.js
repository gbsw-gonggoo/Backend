const express = require('express');
const { User } = require("../models");
const {isLoggedIn} = require("./middlewares");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.session.passport.user.id},
      attributes: ['name', 'number', 'email', 'backgroundImg', 'profileImg']
    })
    if (user) {
      return res.json({success: true, user})
    } else {
      return res.json({success: false, user: null})
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

try {
  fs.readdirSync('backgroundImg');
} catch (error) {
  console.error('backgroundImg 폴더가 없어 backgroundImg 폴더를 생성합니다.');
  fs.mkdirSync('backgroundImg');
}

const uploadBackground = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, './backgroundImg/');
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 } // 3메가로 용량 제한
});

router.post('/background', isLoggedIn, uploadBackground.single('file'), (req, res, next) => {
  User.update({
    image: req.file.path
  }, {
    where: {
      id : req.session.passport.user.id
    }
  })

  res.json({ success: true, message: "성공" });
});

try {
  fs.readdirSync('profileImg');
} catch (error) {
  console.error('profileImg 폴더가 없어 profileImg 폴더를 생성합니다.');
  fs.mkdirSync('profileImg');
}

const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, './profileImg/');
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 } // 3메가로 용량 제한
});

router.post('/profile', isLoggedIn, uploadProfile.single('file'), (req, res, next) => {
  User.update({
    image: req.file.path
  }, {
    where: {
      id : req.session.passport.user.id
    }
  })

  res.json({ success: true, message: "성공" });
});

module.exports = router;
