require('dotenv').config()
const config = {
    database:{
        url: `${process.env.MODBURL}`
        // url:'mongodb://localhost:27017/furniture'
    },
    secretKey: '',
}

module.exports = config;
