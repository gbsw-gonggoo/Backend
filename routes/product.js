const express = require('express');

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Product } = require('../models');
const { where } = require("sequelize");

const router = express.Router();

try {
	fs.readdirSync('uploads');
} catch (error) {
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, done) => {
			done(null, './uploads/');
		},
		filename: (req, file, done) => {
			const ext = path.extname(file.originalname);
			done(null, path.basename(file.originalname, ext) + Date.now() + ext);
		}
	}),
	limits: { fileSize: 3 * 1024 * 1024 } // 3메가로 용량 제한
});

// product 모두 가져오기
router.get('/',  async (req, res, next) => {
	try {
		const product = await Product.findAll()
		if (product) {
			return res.json({success: true, product})
		} else {
			return res.json({success: false, product: null})
		}
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

// product 가져오기
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
		console.error(error);
		return next(error);
	}
});

const upload2 = multer();

router.post('/',  upload2.none(), async (req, res, next) => {
	const { author, image, name, amount, price, text, targetCount, count, maxCount, date, link } = req.body
	try {
		// TODO 값들이 문제 없는지 확인 (if 문 떡칠) ㄱㄱ

		await Product.create( {
			author: author,
			image: image,
			name: name,
			amount: amount,
			price: price,
			text: text,
			targetCount: targetCount,
			count: count,
			maxCount: maxCount,
			date: date,
			link: link,
		});

		res.json({success: true, message: "공구 작성 완료"})
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res, next) => {
	console.log(req.file);
	res.json({ url : `/img/${req.file.filename}` });
});


module.exports = router;