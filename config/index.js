require('dotenv').config()
const config = {
    database:{
        url: `mongodb+srv://kazibwejuliusjunior:${process.env.DBPWD}@furnitureugdb.vywnezf.mongodb.net/`
        // url:'mongodb://localhost:27017/furniture'
    },
    secretKey: '',
}

module.exports = config;
