const express = require('express')  // express모듈을 가져온다.
const app = express()  // 함수를 통해서 새로운 express app을 만든다.
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://gsjung:wjdrltjs@boilerplate.fnipd.mongodb.net/boilerplate?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {  // 5000 포트에서 app을 실행
  console.log(`Example app listening at http://localhost:${port}`)
})