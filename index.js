require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRoute = require('./routes/users')

mongoose.connect(process.env.MONGODB_CONNECTION)
.then(()=>{console.log('database connected')})
.catch((err)=>{console.log(err.message)})

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api/users',userRoute)




app.listen(3000,()=>{
    console.log('listening on port 3000')
})