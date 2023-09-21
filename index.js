const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const app = express()
const SECRET='notagoodsecret'

mongoose.connect("mongodb://localhost:27017/PixelAuth")
.then(()=>{console.log('database connected')})
.catch((err)=>{console.log(err.message)})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({ secret: SECRET }))




app.listen(3000,()=>{
    console.log('listening on port 3000')
})