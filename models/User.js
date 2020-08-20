const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0  // 0 : 일반 , 1 :관리자
    },
    image : String,
    token : {   // 토큰을 이용해서 유효성을 관리
        type : String
    },
    tokenExp : {  // 토큰 유효 기간
        type : Number
    }
})

const User = mongoose.model('User', userSchema) // Schema를 Model로 감싸준다. 첫번째 파라미터는 이 모델의 이름, 두번째는 스키마를 넣는다.

module.exports = { User }  // 이 Model을 다른 파일에서도 쓰고 싶기 때문에 Export 해준다.