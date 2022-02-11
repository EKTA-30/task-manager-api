// const MongoClient = mongodb.MongoClient
const {MongoClient ,ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const objectId = new ObjectID()
// console.log(objectId)

    MongoClient.connect(connectionURL ,{useunifiedtopology: true}, (error,client) => {
        if(error)
        return console.log('Unable to connect to the database')
        else{
        //mongo db let's us create a db by simply picking a name and accessing it
        const db = client.db(databaseName)

//1. Create operation

 // db.collection('tasks').insertMany([
        //     {
        //         description:'Node.js Course',
        //         completed:false
        //     },
        //     {
        //         description:'DSA Java',
        //         completed:false
        //     },
        //     {
        //         description:'Netflix',
        //         completed:true
        //     },
        // ],
        // (error,result) => {
        //     if(error){
        //         return console.log('Unable to insert user')
        //     }
        //     console.log(result.insertedIds)
        // })
        // db.collection('tasks').updateMany(
        //     {completed : false},
        //     { $set: 
        //         { completed: true }
        //     }).then((result) => {
        //         console.log(result)
        //     }).catch((error) => {
        //         console.log(error)
        //     })

//2. Read operation

        // db.collection('tasks').find({completed: false}).toArray((error,task) => {
        //     console.log(task)
        // })
            // db.collection('users').insertOne({
            //     _id :objectId,
            //     name:'Khushi',
            //     age:21
            // }, (error,result) => {
            //     if(error){
            //         return console.log('Unable to insert user')
            //     }
            //     console.log(result.insertedIds)
            // })

//3. Update operation

    //     db.collection('users').updateOne(
    //     {
    //         name:'Ekta'
    //     },
    //    {
    //     $set :
    //     {
    //         name: 'Mike'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
        // db.collection('tasks').findOne({_id: new ObjectID("61e7d0173f5ea9e7d8941e46")}, (error,task) => {
        //     if(error)
        //     return console.log('Unable to fetch task')
            
        //     console.log(task)
        // })
       
//4.Delete operation

// db.collection('tasks').deleteOne({
//     description : 'Netflix',
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

   db.collection('users').deleteMany({
       age:22
   }).then((result) =>{
       console.log(result)
   }).catch((error) =>{
       console.log(error)
   })

        }
    
    })
        