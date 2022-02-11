const { application } = require('express')
const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, deleteUserEmail} = require('../emails/account')
//this is an exprss router
const router = new express.Router()

//. REST API ENDPOINT FOR RESOURCE CREATION (USER)
router.post('/users',async (req,res) => {
    const user = new User(req.body)
    try{
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.send({user,token})
    }
    catch(e){
        console.log(e)
      res.status(400).send(e)
    }
  })
  //.REST API ENDPOINT FOR READING USER PROFILE  (USER)
  router.get('/users/me', auth, async (req,res) =>{
    res.send(req.user)
  })

    //.LOGGING IN USER
    router.post('/users/login', async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    })

    //LOGGING OUT USER
    router.post('/users/logout',auth ,async (req,res)=>{
        try {
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()
            res.status(200).send('User logged out ')
        }
         catch(e) {
            console.log(e)
            res.status(500).send()
        }
    })

    //LOGGING OUT OF ALL SESSIONS

    router.post('/users/logoutAll',auth, async (req,res)=>{
        try {
            req.user.tokens = []
            await req.user.save()
            res.send('Logged out of all the sessions')
        } catch (e) {
            // console.log(e)
            res.status(500).send()
        }
    })
  
  //.REST API ENDPOINT FOR UPDATING  RESOURCE USING ID (USER)
  router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
  //.REST API ENDPOINT FOR DELETING A RESOURCE (USER)
  
  router.delete('/users/me',auth, async (req,res) =>{
     try{
    //   const deletedUser = await User.findByIdAndDelete(req.user._id)
    //   if(!deletedUser)
    //   {
    //       return res.status(404).send({'error':'Canot delete a user which does not exists'})
    //   }
    
      deleteUserEmail(req.user.email,req.user.name)
      await req.user.remove()
      res.send(req.user)
     }
     catch(e){
      res.status(400).send(e)
     }
  })
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        //
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},
(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
  //61f213c4eae870a272066ba8
module.exports = router