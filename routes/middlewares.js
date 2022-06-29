exports.isLoggedIn = (req, res, next) => {
    if( req.isAuthenticated() ) {
        next()
    } else {
        res.json({success: false, message: '로그인이 필요합니다'}).status(401)
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if( !req.isAuthenticated() ) {
        next()
    } else {
        res.json({success: false, message: '로그인된 상태입니다'}).status(400)
    }
}
