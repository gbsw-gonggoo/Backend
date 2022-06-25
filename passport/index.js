const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    // 로그인할 때 실행
    passport.serializeUser( (user, done) => {
        console.log('sdfdsfdsfs' + user.id)
        done(null, user);
    })

    //User.findOne( {
    //             where: {id},
    //             include: [{
    //                 model: User,
    //                 attributes: ['id', 'name'],
    //                 as: 'Followers',
    //             }, {
    //                 model: User,
    //                 attributes: ['id', 'name'],
    //                 as: 'Followings',
    //             }],
    //         })
    //             .then(user => done(null, user))
    //             .catch(err => done(err));

    // 리퀘스트 발생 시
    passport.deserializeUser( (user, done) => {
        // User.findOne( {
        //     where: { id: id },
        // })
        //     .then(user => done(null, user))
        //     .catch(err => done(err));
        const userInfo = {
            user, // serializeUser에서 session에 저장한 정보
            info : 'test message' // deserializeUser에서 추가로 저장한 정보
        };
        done(null, userInfo);
    });

    local();
}