const express = require('express')
const { User, Product } = require("../models")
const { isLoggedIn } = require("./middlewares")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const router = express.Router()

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.user.user.id},
      attributes: ['name', 'nickname', 'number', 'email', 'backgroundImg', 'profileImg'],
      include: [
        {
          model: Product,
          as: "RegisteredProduct",
          attributes: ['id', 'name']
        }
      ]
    })
    if (user) {
      return res.json({success: true, user})
    } else {
      return res.json({success: false, user: null})
    }
  } catch (error) {
    console.error(error)
    return next(error)
  }
})

router.put('/', isLoggedIn, async (req, res, next) => {
  try {
    const { email, nickname } = res.body

    if (req.user.user.email !== email) {
      User.update({
        nickname: nickname,
        email: email,
        emailVerify: false
      }, {
        where: {
          id: req.user.user.id
        }
      })
    } else {
      User.update({
        nickname: nickname,
      }, {
        where: {
          id: req.user.user.id
        }
      })
    }
    return res.json({success: true, message: "업데이트 됨"})

  } catch (error) {
    console.error(error)
    return next(error)
  }
})

try {
  fs.readdirSync('background')
} catch (error) {
  console.error('background 폴더가 없어 background 폴더를 생성합니다.')
  fs.mkdirSync('background')
}

const uploadBackground = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, './background/')
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname)
      done(null, path.basename(file.originalname, ext) + Date.now() + ext)
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 } // 3메가로 용량 제한
})

router.post('/background', isLoggedIn, uploadBackground.single('file'), (req, res) => {
  console.log(req.file.path)
  User.update({
    backgroundImg: "api/user/" + req.file.path.replace("\\", "/")
  }, {
    where: {
      id : req.user.user.id
    }
  })

  res.json({ success: true, message: "성공" })
})

try {
  fs.readdirSync('profile')
} catch (error) {
  console.error('profile 폴더가 없어 profile 폴더를 생성합니다.')
  fs.mkdirSync('profile')
}

const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, './profile/')
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname)
      done(null, path.basename(file.originalname, ext) + Date.now() + ext)
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 } // 3메가로 용량 제한
})

router.post('/profile', isLoggedIn, uploadProfile.single('file'), (req, res) => {
  User.update({
    profileImg: "api/user/" + req.file.path.replace("\\", "/")
  }, {
    where: {
      id : req.user.user.id
    }
  })

  res.json({ success: true, message: "성공" })
})

module.exports = router
