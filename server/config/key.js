const { model } = require("mongoose");

if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');  // prod.js 참조
}else{
    module.exports = require('./dev');  // key.js 참조
}