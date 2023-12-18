const mongoose = require('mongoose');
const vatSchema = new mongoose.Schema({
    country:{type:String,required:false},
    code:{type:String,required:false},
    currency:{type:String,required:false},
    op_rate:{type: Number,required:false},
    vat:{type: Number,required:false},
    createdAt:{type: String,required:false},
    updatedAt:{type: String,required:false},
});

const vatRate =  mongoose.model('vatRate',vatSchema);

module.exports = vatRate;