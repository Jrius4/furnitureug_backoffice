const mongoose = require('mongoose');
const dollarRateSchema = new mongoose.Schema({
    country:{type:String,required:false},
    code:{type:String,required:false},
    currency:{type:String,required:false},
    op_rate:{type: Number,required:false},
    vat:{type: Number,required:false},
    effective_date:{type: String,required:false},
    createdAt:{type: String,required:false},
    updatedAt:{type: String,required:false},
});

const dollarRate =  mongoose.model('dollarRate',dollarRateSchema);

module.exports = dollarRate;