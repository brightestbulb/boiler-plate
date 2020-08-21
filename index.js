const express = require('express')  // express모듈을 가져온다.
const app = express()  // 함수를 통해서 새로운 express app을 만든다.
const port = 5000
const bodyParser = require('body-parser');  // 로그인&회원가입 창에서 입력한 정보를 가져오기 위한 용도

const config = require('./config/key');  // mongoDB 연결 설정 정보를 따로 key.js로 관리

const { User } = require("./models/User");  // User.js 모델을 가져온다.

app.use(bodyParser.urlencoded({extended: true}));  // application/x-www.form-urlencoded 형태의 데이터를 분석해서 가져올 수 있게 하는 설정

app.use(bodyParser.json()); //application/json 타입의 데이터를 가져올 수 있게 하는 설정

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/register', (req, res) => {

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

app.listen(port, () => {  // 5000 포트에서 app을 실행
  console.log(`Example app listening at http://localhost:${port}`)
})