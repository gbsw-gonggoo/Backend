const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use("local", new LocalStrategy( {
        usernameField: 'nickname',
        passwordField: 'password',
    }, async (nickname, password, done) => {
        try {
            const exUser = await User.findOne( {where: { nickname }} );
            // 해당 닉네임을 가진 사용자 존재 여부 확인
            if( exUser ) {
                const result = await bcrypt.compare(password, exUser.password);
                // 닉네임을 가진 사용자는 있되, 비밀번호가 맞는지 확인
                if( result ) {
                    // 로그인 정상 처리
                    done( null, exUser );
                } else {
                    // 비밀번호 불일치
                    done( '비밀번호 불일치', false );
                }
            } else {
                // 미가입 회원
                done( '미가입회원', false );
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};