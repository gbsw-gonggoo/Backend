const express = require('express')
const { isLoggedIn } = require('./middlewares')
const User = require('../models/user')
const Product = require('../models/product')
const Apply = require('../models/apply')

const router = express.Router()

router.post('/:post/:amount', isLoggedIn, async (req, res, next) => {
	const postId = parseInt(req.params.post, 10)
	const amount = parseInt(req.params.amount, 10)
	const userId = req.user.user.id

	try {
		const post = await Product.findOne({ where: {id: postId} })
		if (!post) {
			return res.json({ success: false, message: "게시글이 존재하지 않습니다" })
		}

		const applyRecord = await Apply.findOne({ where: { registeredProduct: postId, registeredUser: userId } })
		if (applyRecord) {
			if (amount === 0) {
				Apply.destroy({
					where: { registeredProduct: postId, registeredUser: userId }
				})
				return res.json({success: true, message: "신청을 취소했습니다"})
			}
			else {
				Apply.update({amount: amount}, {
					where: { registeredProduct: postId, registeredUser: userId }
				})
				return res.json({success: true, message: amount + "개로 수정했습니다"})
			}
		}

		const user = await User.findOne({ where: {id: userId} })
		await user.addRegisteredUser(postId, { through: {amount: amount} })
		return res.json({success: true, message: `${amount}개 신청을 완료했습니다`})

	} catch (error) {
		console.error(error)
		return next(error)
	}
})

module.exports = router
