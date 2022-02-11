const Task = require('../models/task')
const auth = require('../middleware/auth')
const express = require('express')
//this is an express router
const router = new express.Router()

//1.REST API ENDPOINT FOR RESOURCE CREATION ENDPOINT (TASK)
router.post('/tasks', auth,async (req,res) =>{
    const task = new Task({
       ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }
    catch (e){
        res.status(400).send()
    }
})
//2.REST API ENDPOINT FOR READING ALL RESOURCES (TASK)
//setting up data filtering to enable searching options in this route
//GET tasks/?completed=true
//GET tasks/?limit=2&skip=2
router.get('/tasks', auth, async (req,res) =>{
    const match = {}
    const sort = {}
    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ?-1:1
    }
    try{
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
})
//3.REST API END POINT FOR READING A RESOURCE BY ID (TASK)

router.get('/tasks/:id',auth, async(req,res) =>{
    const _id = req.params.id

    try{
       const task = await Task.findOne({_id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        else{
            res.send(task)
        }
    }
    catch(e){
        res.status(500).send()
    }
})
//4.REST API ENDPOINT FOR UPDATING A RESOURCE BY ID (TASK)

router.patch('/tasks/:id', auth, async (req,res) => {
const updates = Object.keys(req.body)
const validUpdates = ['description','completed']

const isValidnOperation = updates.every((update) => validUpdates.includes(update))
if(!isValidnOperation)
return res.status(400).send({'error':'Invalid update'})

   try{
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
    const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
    if(!task){
        return res.status(404).send()
    }
    updates.forEach((update)=> task[update] = req.body[update])
    await task.save()

    res.send(task)
   }
   catch(e){
       res.status(400).send(e)
   }
})
//5.REST API ENDPOINT FOR DELETING A RESOURCE BY ID (TASK)

router.delete('/tasks/:id', auth ,async (req,res) =>{
 try{
    // const deletedTask =  await Task.findByIdAndDelete(req.params.id)
    const deletedTask = await Task.findOneAndDelete({_id: req.params.id ,owner: req.user._id})
    if(!deletedTask)
    {
        res.status(404).send()
    }
    res.send(deletedTask)
 }
 catch(e){
     console.log(e)
     res.status(400).send(e)
 }
})

module.exports =  router