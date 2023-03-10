const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
router.post('/tasks/me', auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner : req.user._id
    })
    try {
       await task.save()
       res.status(201).send(task)
    } catch (e) {
       res.status(400).send(e)
    }
 
    // task.save().then((task)=>{
    //       res.status(201).send(task)
    // }).catch((error)=>{
    //        res.status(400).send(error)
 
    // })
 })

 router.get('/tasks', auth, async (req, res) => {

   const match = {}
   const sort = {}
   // console.log(req.query.completed)
   if(req.query.completed){
      match.completed = (req.query.completed === 'true')
   }
   if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
   }
    try {
      //  const task = await Task.find({owner: req.user._id})
      await req.user.populate({path : 'tasks',
      match,
      options : {
         limit : parseInt(req.query.limit),
         skip : parseInt(req.query.skip),
         sort 
      }
   })
       res.send(req.user.tasks)
    } catch (e) {
       res.status(500).send(e)
    }
    // Task.find({}).then((task)=>{
    //           res.send(task)
    // }).catch((e)=>{
    //   res.status(500).send(e)
    // })
 })
 
 router.get('/tasks/:id',auth,  async (req, res) => {
 
    const _id = req.params.id
 
    try {
       const task = await Task.findOne({_id,owner : req.user._id})
       if (!task) {
          return res.status(400).send()
       }
       res.send(task)
    } catch (e) {
       res.status(500).send(e)
    }
 
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(400).send()
    //     }
    //           res.send(task)
    // }).catch((e)=>{
    //   res.status(500).send(e)
    // })
 })

 router.patch('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
 
    if(!isValidOperation){
     return   res.status(400).send({error : "Invalid update!"})
    }
     
    
 
    try {
       const task = await Task.findOne({_id, owner: req.user._id})
 
       if (!task) {
          return res.status(400).send()
       }

       updates.forEach((update)=> task[update] = req.body[update])
       task.save()
       res.send(task)
    } catch (e) {
       res.status(400).send(e)
    }
 })

 router.delete('/tasks/:id', auth, async (req,res)=>{
   
    const _id = req.params.id
 
    try{
       const deleted = await Task.findOneAndDelete({_id, owner : req.user._id})
 
       if(!deleted){
        return   res.status(400).send({error : 'Invalid delete operation!'})
       }
      //  deleted.remove()
       res.send(deleted)
    } catch(e){
       res.status(500).send(e)
    }
 })

 module.exports = router 