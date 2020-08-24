const { User } = require('../models/User');

let auth = (req, res, next) => {  // 인증처리를 여기서 처리
    // 1. 클라이언트의 cookie에서 token을 가져온다. 
    let token = req.cookies.x_auth;

    // 2. token을 복호화하고 user를 찾는다.
    User.findByToken(token, (err, user)=>{
        if(err){
            throw err;
        }
        if(!user){  // user가 없을 때
            return res.json({ isAuth: false, error: true })
        }
        // 3. user가 있으면 인증 성공
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };