const express = require('express')
const { isLoggedIn } = require('./middlewares')
const User = require('../models/user')
const Product = require('../models/product')
const Apply = require('../models/apply')

const router = express.Router()

router.post('/:post/:amount', isLoggedIn, async (req, res, next) => {
	const productId = parseInt(req.params.post, 10)
	const amount = parseInt(req.params.amount, 10)
	const userId = req.user.user.id

	try {
		const product = await Product.findOne({ where: {id: productId} })
		if (!product) {
			return res.json({ success: false, message: "게시글이 존재하지 않습니다" })
		}

		const applyRecord = await Apply.findOne({ where: { registeredProduct: productId, registeredUser: userId } })

		const productCount = product.count

		if (applyRecord) {
			const appliedCount = applyRecord.amount
			Product.update({count: productCount - appliedCount + amount}, {
				where: { id: productId }
			})

			if (amount === 0) {
				const user = await User.findOne({ where: {id: userId} })
				await user.removeRegisteredProduct(productId)
				return res.json({success: true, message: "신청이 취소되었습니다"})
			}
			else {
				Apply.update({amount: amount}, {
					where: { registeredProduct: productId, registeredUser: userId }
				})
				Product.update({count: productCount - appliedCount + amount}, {
					where: { id: productId }
				})
				return res.json({success: true, message: amount + "개로 수정되었습니다"})
			}
		}
		Product.update({
			count: productCount + amount
		},{
			where: { id: productId }
		})

		const user = await User.findOne({ where: {id: userId} })
		await user.addRegisteredProduct(productId, { through: {amount: amount} })
		return res.json({success: true, message: `${amount}개 신청이 완료되었습니다`})

	} catch (error) {
		console.error(error)
		return next(error)
	}
})

module.exports = router
