const express = require('express')
const cors = require('cors')
const Tables = require('./Tables')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/:id',async(req,res)=>{
    const {id} = req.params
    try{
        
    if(!id){
        res.status(200).json({message:'no id'})
    }
        const table = await Tables.findById(id)

        res.status(200).json(table)
    }catch{
        res.status(500).json(e)
    }


})
app.post('/create' , async (req,res)=>{
    const {line, square, text,eraser } = req.body

    const table = await Tables.create({line,square,text, eraser})

    return res.status(200).json(table)
})

module.exports = ()=>{
    try{
        app.listen(8000 , ()=> console.log('Server started ' + 8000 ))
    }catch (e){
        console.log(e)
    }
}