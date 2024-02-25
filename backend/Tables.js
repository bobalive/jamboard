const mongoose = require('mongoose');

const TableScema = new mongoose.Schema({
    line: { type: [[Object]], required: true },
    eraser:{type:[[Object]] ,required: true},
    squares: { type: [{width: Number,height:Number,top:Number,left:Number}], required: true },
    texts:{type:[{width: Number,height:Number,top:Number,left:Number ,value:String}] , required:true},
});

module.exports = mongoose.model("Tables", TableScema);