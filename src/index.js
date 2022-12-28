const express = require('express')
require('./db/mongoose')

const Userroutes = require('./routers/user')
const Taksroutes = require('./routers/task')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()

const port = process.env.PORT


app.use(express.json())

app.use(Userroutes)
app.use(Taksroutes)

const multer = require('multer')

const upload = multer({
   dest : 'images'
})

app.post('/upload' ,upload.single('upload') ,(req , res)=>{
         res.send('Uploaded succesfully!') 
})

app.listen(port, () => {
   console.log('Server is up on port ' + port)
})
