const express = require('express')
const path = require('path')
const fs = require('fs')
const { isLoggedIn } = require('./middlewares')
const { Product } = require('../models')
const multer = require('multer')

const router = express.Router()

try {
	fs.readdirSync('img')
} catch (error) {
	console.error('img 폴더가 없어 img 폴더를 생성합니다.')
	fs.mkdirSync('img')
}

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, done) => {
			done(null, './img/')
		},
		filename: (req, file, done) => {
			const ext = path.extname(file.originalname)
			done(null, path.basename(file.originalname, ext) + Date.now() + ext)
		}
	}),
	limits: { fileSize: 3 * 1024 * 1024 }
})
const upload2 = multer()

router.post('/img', isLoggedIn, upload.single('file'), (req, res) => {
	console.log(req.file)
	res.json({ success: true, message: "성공" })
})

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
	const { amount, price, text, targetCount, maxCount, date, link } = req.body
	try {

		if (name == null) {
			res.json({success: false, message: "실패"})
		}
		if (price == null) {
			res.json({success: false, message: "실패"})
		}
		if (targetCount == null) {
			res.json({success: false, message: "실패"})
		}
		if (maxCount == null) {
			res.json({success: false, message: "실패"})
		}
		if (date == null) {
			res.json({success: false, message: "실패"})
		}
		if (link == null) {
			res.json({success: false, message: "실패"})
		}
		const image = req.file.path

		await Product.create( {
			author: req.user.user, // allowNull : false,
			name: req.user.use.name, // allowNull : false,
			amount: amount, // allowNull : false,
			price: price, // allowNull : false,
			image: image, // allowNull : true,
			text: text, // allowNull : true,
			targetCount: targetCount, // allowNull : false,
			count: 0, // allowNull : false,
			maxCount: maxCount, // allowNull : false,
			date: date, // allowNull : false,
			link: link, // allowNull : false,
		})

		res.json({success: true, message: "공구 작성 완료"})
	} catch (error) {
		console.error(error)
		return next(error)
	}
})

router.get('/',  async (req, res, next) => {
	try {
		let isLogin
		isLogin = !!req.session

		const product = await Product.findAll()
		if (product) {
			return res.json({success: true, isLogin, product})
		} else {
			return res.json({success: false, isLogin, product: null})
		}
	} catch (error) {
		console.error(error)
		return next(error)
	}
})

router.get('/:id', async (req, res, next) => {
	const productId = req.params.id
	try {
		const product = await Product.findOne({where: {id: productId}})
		if (product) {
			return res.json({success: true, product})
		} else {
			return res.json({success: false, product: null})
		}

	} catch (error) {
		console.error(error)
		return next(error)
	}
})

module.exports = router
