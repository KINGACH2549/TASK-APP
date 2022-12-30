const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const deletetasks = require('../middleware/deleteProfile')
const sharp = require('sharp')
const multer = require('multer')

const upload = multer({
   limits : {
      fileSize : 1000000
   },
   fileFilter(req , file , cb){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
         cb(new Error('Please upload an image!'))
      }
      cb(undefined , true)
   }
})
router.post('/users', async (req, res) => {
    const user = new User(req.body)

 
    //  user.save().then((user)=>{
    //        res.status(201).send(user)  // creation status code (201)
    //  }).catch((error)=>{
    //         res.status(400).send(error)
 
    //  })
 
   //  await user.save()
 
    try {
       const token = await user.generateauthToken()
      //  console.log(token)
      //  res.cookie("jwt",token , {
      //    httpOnly : true
      //  })
       res.status(200).redirect('http//:localhost:3000')
       res.status(201).send({user , token})
    } catch (e) {
       res.status(400).send(e)
    }
 })

 router.post('/users/login' , async (req, res)=> {
   try{
      const user = await User.findByCredentials(req.body.email , req.body.password)
      const token = await user.generateauthToken()
      res.send({user, token})
   } catch(e){
      res.status(400).send(e)
   }
 })

 router.post('/users/logout', auth,  async(req, res)=>{
   try{
        req.user.tokens = req.user.tokens.filter((token)=>{
          return token.token !== req.token 
        })
        
        await req.user.save()
      //   res.clearCookie("jwt")
        res.send('Logged out succesfully!')
   } catch(e){
      res.status(500).send('Unable to log out !')
   }
 })

 router.post('/users/logoutAll' , auth , async(req , res)=>{
   try{
       req.user.tokens = []
        
       await req.user.save()
      //  res.clearCookie("jwt")
       res.send('Logged out succesfully!')
   } catch(e){
      res.status(500).send()
   }
 })
 router.get('/users/me', auth, async (req, res) => {

   //  try {
   //     const user = await User.find({})
   //     res.send(user)
   //  } catch (e) {
   //     res.status(500).send(e)
   //  }
   //  // User.find({}).then((users)=>{
   //  //   res.send(users)
   //  // }).catch((e)=>{
   //  //   res.status(500).send(e)
   //  // })

   res.send(req.user)
 }
 )


 router.patch('/users/me', auth , async (req, res) => {

 
    const updates = Object.keys(req.body)
    const allowedUpates = ['name', 'age', 'email', 'password']
 
    const isValidOperation = updates.every((update) => allowedUpates.includes(update))
 
    if (!isValidOperation) {
       return res.status(400).send({ error: 'Invalid updates!' })
    }
 
    try {
      //  const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })  doesn't run middle-ware.

      // const user = await User.findById(req.params.id)
      // if (!user) {
      //    return res.status(400).send()
      // }

      updates.forEach((update)=> req.user[update] = req.body[update])

      await req.user.save()
 
      //  if (!user) {
      //     return res.status(400).send()
      //  }
       res.status(200).send(user)
    } catch (e) {
       res.status(400).send(e)
    }
 
 
 })

 router.delete('/users/me', auth,deletetasks, async (req,res)=>{
   
    
 
    try{
      //  const deleted = await User.findByIdAndDelete(req.user._id)
 
      //  if(!deleted){
      //   return   res.status(400).send({error : 'Invalid delete operation!'})
      //  }
       
       await req.user.remove()
       res.send(req.user)
    } catch(e){
       res.status(500).send(e)
    }
 })

 router.post('/users/me/avatar' ,auth, upload.single('avatar'), async (req,res)=>{
         const buffer = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
           req.user.avatar = buffer
           await req.user.save() 
           res.send('UPLOADED SUCCESFULLY!')
 },(error , req , res , next)=>{
      res.status(400).send({error : error.message})
 })

 router.delete('/users/me/avatar', auth , async(req, res)=>{
         req.user.avatar = undefined 
         await req.user.save()

         res.send('deleted pic successfully!')
 })

 router.get('/users/:id/avatar' , async (req, res)=>{

   try{
      const user = await User.findById(req.params.id)
     
       if(!user || !user.avatar){
         throw new Error('No profile pic!')
       }

       res.set('Content-Type' , 'image/png')

       res.send(user.avatar)
   } catch(e){
      res.status(400).send({error : e.message})
   }
 })
 module.exports = router