const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

//mongoose 기능으로, index.js에서 save() 하기 전에 적용할 함수를 추가
userSchema.pre('save', function( next ){
    var user = this;  // user model에 들어있는 값을 가져오기 위해 사용

    if(user.isModified('password')){
        // 비밀번호를 암호화.
        bcrypt.genSalt(saltRounds, function(err, salt){  // Salt 생성 - saltRounds 필요
            if(err){
                return next(err);  // index.js의 save()로 에러 전달
            }
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err){
                    return next(err);
                }
                user.password = hash; // hash : 암호화된 비밀번호
                next(); // index.js의 save()에서 시작
            });
        });
    }else{
        next()
    }
})

// 입력받은 비밀번호가 유효한지 DB값과 비교하여 검증하는 함수
userSchema.methods.comparePassword = function(plainPassword, cb){  // cb : callBack func
    // bcrypt.compare 함수를 통해서 입력받은 암호를 암호화 하고, 실제 DB의 암호화 된 값과 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){  // isMatch : true || false
        if(err){
            return cb(err);
        }else{
            cb(null, isMatch);
        }
    })
}

userSchema.methods.generateToken = function(cb){
    //jsonWebToken을 이용해서 토큰을 생성하기
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken');  // _id : mongoDB에 각 데이터의 id 
    // user._id + 'secretToken' = token, 나중에 token을 해석할 때, 'secretToken'을 넣으면 user._id가 나온다. 
    user.token = token;
    user.save(function(err, user){
        if(err){
            return cb(err);
        }else{
            cb(null, user);
        }
    })
}


const User = mongoose.model('User', userSchema) // Schema를 Model로 감싸준다. 첫번째 파라미터는 이 모델의 이름, 두번째는 스키마를 넣는다.

module.exports = { User }  // 이 Model을 다른 파일에서도 쓰고 싶기 때문에 Export 해준다.