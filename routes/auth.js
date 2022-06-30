const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const User = require('../models/user')

const router = express.Router()

// 회원가입
router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const { nickname, password, passwordChk, name, email, number } = req.body
    try {
        const exUser = await User.findOne( { where: { email: email }} )
        if (exUser) {
            return res.json({success: false, message: "이메일이 이미 존재합니다"})
        }
        const exUser2 = await User.findOne( { where: { nickname: nickname }} )
        if (exUser2) {
            return res.json({success: false, message: "닉네임이 이미 존재합니다"})
        }
        if (password !== passwordChk) {
            return res.json({success: false, message: "비밀번호가 같지 않습니다"})
        }

        const hash = await bcrypt.hash(password, 12)
        await User.create({
            email,
            nickname,
            name,
            number,
            password: hash,
        })
        return res.json({success: true, message: "성공"})

    } catch (error) {
        console.error(error)
        return next(error)
    }
})

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', {},(authError, user) => {
        // 인증 오류 발생 시
        if (authError) {
            return res.json({success: false, message: "아이디 혹은 비밀번호를 확인해주세요"})
        }
        // 사용자 정보가 없을 시
        if (!user) {
            return res.json({success: false, message: "아이디 혹은 비밀번호를 확인해주세요"})
        }
        // 정상적인 로그인의 경우
        req.login(user, (loginError) => {
            if( loginError ) {
                console.error(loginError)
                next(loginError)
            }
            res.json({success: true, message: "로그인 성공"})
        })
    })(req, res, next)
})

// 로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.session.destroy()
    res.json({success: true, message: '로그아웃 됨'})
})

module.exports = router