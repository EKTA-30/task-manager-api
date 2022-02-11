//cd mongodb-data
//  mongod.exe --dbpath="D:\Web Dev\mongodb-data"
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//express application creation
 const app = express()
 const port = process.env.PORT

 //this is the function that is going to run between the request coming to the server and the route handler actually running
//  app.use((req,res,next) => {
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//     }
//     else{
//         next()
//     }
//     //letting express know that we are done with the middleware function
  
//  })

// app.use((req,res,next) => {
//     res.status(503).send('Site under maintainance, sorry for the inconvenience')
// })
//parses incoming JSON to an object

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Since we are receiving the authentication token while signup and login, we need to decide how to use those aut codes to send to other requests
//1. WITHOUT MIDDLEWARE : new request ---> run route handler( for dozens of requests previously)
//2. WITH MIDDLEWARE    : new request --->do something ----> run route handler
//This do something could be many things like logging statistics of requests in the server
//we can prevent the route handler from running if user is not authenticated etc

//Login and signup do not require authentication to work

 app.listen(port, () => {
     console.log('Server is up on port '+port)
 })
