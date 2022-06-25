const express = require('express');

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Product } = require('../models');
const {where} = require("sequelize");

const router = express.Router();

try {
	fs.readdirSync('uploads');
} catch (error) {
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

const upload = multer({
	storage : multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limit : { fileSize : 10 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
	console.log(req.file);
	res.json({ url : `/img/${req.file.filename}` });
});

router.get('/',  async (req, res, next) => {
	try {
		const product = await Product.findAll()
		res.json({product})
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

const upload2 = multer();

router.post('/',  upload2.none(), async (req, res, next) => {
	const { author, image, name, amount, price, text, targetCount, count, maxCount, date, link } = req.body
	try {
		// TODO 값들이

		// TODO 공구 신청
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

// product 가져오기
router.get('/:id', async (req, res, next) => {
	const productId = req.params.id
	try {
		// TODO id에 해당하는 product return

	} catch (error) {
		console.error(error);
		return next(error);
	}
});


module.exports = router;