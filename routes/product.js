const express = require('express')
const path = require('path')
const fs = require('fs')
const { isLoggedIn } = require('./middlewares')
const { Product, User } = require('../models')
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

router.post('/img', isLoggedIn, upload.single('file'), (req, res) => {
	console.log(req.file)
	res.json({ success: true, message: "성공" })
})

router.post('/', isLoggedIn, upload.single('file'), async (req, res, next) => {
	const { amount, name, price, text, targetCount, maxCount, date, link } = req.body

	try {
		if (name == null) {
			res.json({success: false, message: "품목명을 입력해주세요"})
		}
		if (price == null) {
			res.json({success: false, message: "가격을 입력해주세요"})
		}
		if (targetCount == null) {
			res.json({success: false, message: "최소 수량을 입력해주세요"})
		}
		if (maxCount == null) {
			res.json({success: false, message: "마감 수량을 입력해주세요"})
		}
		if (date == null) {
			res.json({success: false, message: "마감 날짜를 입력해주세요"})
		}
		console.log(date)
		if (date < new Date())
		if (link == null) {
			res.json({success: false, message: "상세 링크를 입력해주세요"})
		}
		let image
		try {
			image = req.file.path
		} catch (err) {
			console.log(err)
			image = ""
		}

		await Product.create( {
			author: req.user.user.name, // allowNull : false,
			name: name, // allowNull : false,
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

router.delete('/:id', async (req, res, next) => {
	const productId = req.params.id

	try {
		const product = await Product.findOne({where: {id: productId}})
		if (product) {
			Product.destroy({
				where: { id: productId }
			})
			return res.json({success: false, message: "삭제되었습니다"})
		} else {
			return res.json({success: false, message: "삭제할 게시글이 존재하지 않습니다"})
		}

	} catch (error) {
		console.error(error)
		return next(error)
	}
})

// TODO 수정 기능

router.get('/:id', async (req, res, next) => {
	const productId = req.params.id

	try {
		const product = await Product.findOne({
			where: { id: productId },
			include: [
				{
					model: User,
					as: 'RegisteredProduct',
					attributes: ['number', 'name']
				}
			]
		})

		if (product) {

			return res.json({success: true, product})
		} else {
			return res.json({success: false, product: null, apply: null})
		}

	} catch (error) {
		console.error(error)
		return next(error)
	}
})

module.exports = router
