// production
module.exports = {
    mongoURI: process.env.MONGO_URI  // MONGO_URI는 나중에 heroku 에서 설정하는 Config Vars의 이름과 같으걸로 해줘야 한다.
}