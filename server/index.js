const express = require('express')  // express모듈을 가져온다.
const app = express()  // 함수를 통해서 새로운 express app을 만든다.
const port = 5000
const bodyParser = require('body-parser');  // 로그인&회원가입 창에서 입력한 정보를 가져오기 위한 용도
const cookieParser = require('cookie-parser'); // 로그인 시 생성후 저장한 쿠키를 가져오기 위한 용도
const config = require('./config/key');  // mongoDB 연결 설정 정보를 따로 key.js로 관리
const { auth }  = require('./middleware/auth');
const { User } = require("./models/User");  // User.js 모델을 가져온다.

app.use(bodyParser.urlencoded({extended: true}));  // application/x-www.form-urlencoded 형태의 데이터를 분석해서 가져올 수 있게 하는 설정
app.use(bodyParser.json()); //application/json 타입의 데이터를 가져올 수 있게 하는 설정
app.use(cookieParser());

const mongoose = require('mongoose')  // mongoose 사용해서 mongoDB 연동
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello', (req, res) =>{
  res.send('안녕하세요')
})

app.post('/api/users/register', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err){
      return res.json({success:false, err})  // 에러시 json 형태로 응답
    }
    return res.status(200).json({
      success: true
    })
  }); // User Model에 저장
})


app.post('/api/users/login', (req, res)=>{  // req : 화면에서 입력받은 값을 body에 저장

  // 1. 요청된 이메일을 DB에서 있는지 찾는다.
  User.findOne({ email : req.body.email }, (err, user)=>{  // findOne : mongoDB에서 제공하는 함수
    if(!user){  // 입력받은 email을 가진 User가 없다면
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 2. 이메일이 유효하다면 비밀번호가 알맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {  // comparePassword : User.js에서 정의한 함수
      if(!isMatch){
        return res.json({ loginSuccess : false, message: "비밀번호가 틀렸습니다."})
      }

      // 3. 비밀번호가 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if(err){
            return res.status(400).send(err);
        }else{
            // 토큰을 쿠키에 저장
            res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess : true, userId : user._id })
        }
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {  // auth 는 middleware, auth 로직을 정상적으로 통과해야 아래 함수 로직 실행 가능
  res.status(200).json({
      _id : req.user._id,
      isAdmin: req.user.role === 0? false : true,
      isAuth : true,
      email : req.user.email,
      name : req.user.name,
      lastname : req.user.lastname,
      role : req.user.role,
      image : req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id : req.user._id}, 
      {token:""}  // 토큰을 지워준다.
      , (err, user)=>{
          if(err){
            return res.json({ success: false, err})
          }else{
            return res.status(200).send({
              success: true
            })
          }
      })
})

app.listen(port, () => {  // 5000 포트에서 app을 실행
  console.log(`Example app listening at http://localhost:${port}`)
})