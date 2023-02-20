const express = require('express')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const { MongoError } = require('mongodb')
const app = express()

/*function Taska() {
    this.name = 'math homework',
        this.desc = '',
        this.due = '2022-12-27',
        this.priority = 3,
        this.maxPriority = 5,
        this.estimatedTime = 0,
        this.tags = { 1: 'math class' }
}
var taska = new Taska()*/
/*
*Api function: turn submitted task object into new displayed task object, sort objects into correct 
order, split tasks into today and everything lists. Submit lists back as today and everything objects
*Submitted object: name, description, due, priority, maxPriority, estimatedTime, {tags}, status
*Displayed object: name, description, due, priority, maxPriority, estimatedTime, {tags}, status, {switchTimes},
*status can be 'live' or 'finished'

*dates use ISO-8601 format YYYY-MM-DDTHH:MM:SS, where the T stays as T and other values can be substituted
in. More precise numbers can be removed depending on needed precision (could be YYYY-MM only)
*durations use ISO-8601 format PnYnMnDTnHnMnS, where P2Y5D would equal a duration of 2 years, 5 days
*priority can range from 1-5
*estimatedTime should be sent to api in milliseconds
Necessary help functions:
*getters and setters for every object value


*/
var user1
async function addTask() {
    const uri = "mongodb+srv://admin:PASSWORD@mflix.5cbzlet.mongodb.net/?retryWrites=true&w=majority"

    const client = new MongoClient(uri)
    console.log("connecting to database")
    try {
        await client.connect()
        user1 = await client.db('Todo').collection('User1')       //creates collection handle used for CRUD
        console.log("collection handle successfully created")
    }
    catch (e) {
        console.log("error occurred connecting to db: " + e)
    }

}

addTask()
//.catch(console.error)


//calculates switch times for inputted task by evenly splitting time between [current time] and [due]-[estimatedTime] into
//[maxPriority]-[priority] intervals. Returns an array of switchTimes in iso format
/*function findSwitchTimes(task) {
    intervals = task.maxPriority - task.priority
    if (intervals == 0) {             //no intervals means priority doesn't switch
        return null
    }
    due = new Date(task.due)
    dueMS = due.getTime()           //due date in milliseconds (date object)
    let today = new Date()          //current time in iso format
    currentMS = today.getTime()     //current time in milliseconds
    estimatedTime = task.estimatedTime
    if (estimatedTime < 86400000) {   //ensures that highest priority will be reached a minimum of a day before due
        estimatedTime = 86400000
    }
    lastSwitch = dueMS - estimatedTime
    intervalTime = (lastSwitch - currentMS) / intervals
    switchTimes = []
    for (let i = 1; i <= intervals; i++) {    //calculates each intervalTime and adds it to the array
        let nextInterval = new Date(currentMS + (intervalTime * i))
        switchTimes.push(nextInterval.toJSON())
    }
    return switchTimes
}*/


//converts Task sent by frontend to RichTask which is stored in db and sent back to frontend
/*function convertTask(task) {
    switchTimes = findSwitchTimes(task)
    task.switchTimes = switchTimes
    return task
}*/

//middleware to check Task object to make sure all values exist and are correct; if not sends an error response
//NOTE: will now be doing this inline instead of server-side, function not currently needed
function validate(req, res, next) {

}

//middleware to convert query string params into Task object
function paramsToObject(req, res, next) {
    const taskname = req.body.name
    const { desc } = req.body
    const { due } = req.body
    const { priority } = req.body
    const { maxPriority } = req.body
    const { estimatedTime } = req.body
    const { tasks } = req.body
    const { status } = req.body

    function Task() {           //creates Task object
        this.name = taskname,
            this.desc = desc,
            this.due = due,
            this.priority = priority,
            this.maxPriority = maxPriority,
            this.estimatedTime = estimatedTime,
            this.tags = tasks
            this.status = status
    }
    var task = new Task()
    richTask = convertTask(task)
    req.body.task = richTask        //adds the rich task object to req body
    next()
}

//middleware to convert query string params into Subtask object; additionally creates unique id for the subtask
function paramsToSubtask(req,res,next){
    const {name, desc, loc} = req.body
    const subtaskId = new ObjectId()
    function Subtask() {
        this.name = name
        this.desc = desc
        this.loc = parseInt(loc)
        this.subtaskId = subtaskId
    }
    var Subtask = new Subtask()
    req.body.subtask = Subtask
    next()
}

function findHole(subtaskArray){
    var sum = 0
    var has0 = false
    console.log("subtask array being looped through: " + JSON.stringify(subtaskArray))
    subtaskArray.map(i=>{
        console.log("location in this loop: " + i.loc)
        if(i.loc == 0){
            has0 = true
        }
        sum += i.loc
    })
    console.log("has0 was found to be " + has0)
    if(!has0){
        return 0
    }
    expectedSum = subtaskArray.length * (subtaskArray.length - 1) / 2
    missingIndex = expectedSum - sum
    if(missingIndex == 0){
        return null
    }
    console.log("in findHole, missng index was found by subtraction to be " + missingIndex)
    return missingIndex
}

//returns subtaskArray with the submitted subtask added
async function addSubtask(req,res){
    let {subtask} = req.body
    let {loc} = subtask       //need to make this an int, not a string
    console.log("typeof loc given by request: " + typeof loc + ", and loc is " + loc)
    let {taskId} = req.params
    try{
        let subtaskArray = await user1.findOne({_id: ObjectId(taskId)}, {projection:{subtasks:1, _id:0}})   //gets all subtasks under the task
        console.log("subtask array directly from server: " + JSON.stringify(subtaskArray))
        if(Object.keys(subtaskArray).length==0){        //if there are no subtasks under that task, the subtask is implemented as the first subtask
            subtask.loc = 0
            subtaskArray = [subtask]
            console.log("subtaskarray was found to have length 0")
            return subtaskArray
        }
        subtaskArray = Array.from(subtaskArray.subtasks)     //subtaskArray is converted to an array to do array medthods on it
        if(loc+1){      //if a location was given, all subtasks located at the same position and after the given location must be incremented by 1
            let findHoleResult = findHole(subtaskArray)         //if there's a 'hole', this will give its index (used for updating)
            if(findHoleResult != null)
            {
                loc = findHoleResult
                console.log("hole was found and it was " + loc)
            }
            else{
                subtaskArray.map(i =>{
                    console.log("i.loc is " + i.loc + "and loc is " + loc)
                    if(i.loc>=loc)
                        i.loc+=1
                })
            }
        }
        else{       //if no location was given, the subtask's location will be at the end of the list
            subtask.loc = subtaskArray.reduce((currentMax,subtask) => currentMax>subtask.loc ? currentMax : subtask.loc, 0) + 1     //finds max loc and sets the new loc to 1 more than that
            console.log("in the logic to make loc 1 more than the max, typeof loc is: " + typeof loc)
        }
    subtaskArray.push(subtask)      //the new subtask is added to the array of subtasks
    return subtaskArray          //the new array of subtasks replaces the old array of subtasks
    }
    catch(e){
    console.log("subtask addSubtask error: " + e)
    throw new Error(e)
    }
}

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

//gets all live tasks from server
app.get('/', async (req, res) => {
    try {
        let allTasks = await user1.find({status:'live'}).toArray()
        console.log(allTasks)
        return res.status(200).json(allTasks)
    }
    catch (e) {
        console.log("get error: " + e)
        return res.status(404).json({ status: "get error" })
    }


})

//writes task to server and returns rich task to frontend
app.post('/', [express.urlencoded({ extended: false }), paramsToObject], async (req, res) => {       
    let { task } = req.body
    let {name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes} = task;
    try { 
        let insertResult = await user1.insertOne(
            {name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes})
        return res.status(200).json({ _id: insertResult.insertedId, name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes})
    }
    catch (e) {
        return res.status(404).json({ failure: e })
    }
})

//writes subtask to server underneath its associated task
app.post('/subtask/:taskId', [express.urlencoded({ extended: false }), paramsToSubtask], async (req,res) =>{ 
    let {taskId} = req.params
    try{
    let subtaskArray = await addSubtask(req,res)    //helper method extracts array of all subtasks for the given task then adds the new one, making necessary adjustments, and returns new array of subtasks
    let updateResult = await user1.updateOne({_id: ObjectId(taskId)},{$set: {subtasks: subtaskArray}})          //the new array of subtasks replaces the old array of subtasks
    return res.status(200).json(subtaskArray)       //the new array of subtasks is sent back in the response
    }
    catch(e){
    console.log("subtask post eror: " + e)
    return res.status(404).json({subtask_post_error: e})
    }
})

//task is updated and the updated rich task is returned
app.put('/', [express.urlencoded({ extended: false }), paramsToObject], async (req, res) => {
    let { task } = req.body
    let {name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes} = task;
    try {
        const taskid = req.body._id
        let updateResult = await user1.updateOne({ _id: ObjectId(taskid) }, { $set: { name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes } })
        return res.status(200).json({_id: taskid, name, desc, due, priority, maxPriority, estimatedTime, tags, status, switchTimes})
    }
    catch (e) {
        console.log("update error: " + e)
        return res.status(404).json({ failure: e })
    }
})

//updates the subtask with the given id that is under the task with the given id by replacing the old subtask with a new one
//Requires location field in submitted new subtask
//Questions/things to fix: 
//*location of highest one is randomly incremented
//*loc incrementing not working correctly: 1+1=11
//I don't think the addtask method can be used for post and put simultaneously, or it needs to be updated so it can support a situation where 
    //the list of locations has a hole in it which messes everything up in its current state 
app.put('/subtask/:taskId/:subtaskId', [express.urlencoded({ extended: false }), paramsToSubtask], async (req,res)=>{
    let {taskId} = req.params
    let {subtaskId} = req.params
    try{
    let removeSubtask = await user1.updateOne({_id: ObjectId(taskId)},{$pull:{subtasks:{subtaskId:ObjectId(subtaskId)}}})
    let subtaskArray = await addSubtask(req,res)
    let updateResult = await user1.updateOne({_id: ObjectId(taskId)},{$set: {subtasks: subtaskArray}})
    return res.status(200).json({subtaskArray})
    }
    catch(e){
        console.log("subtask put error: " + e)
        return res.status(404).json({subtask_put_error:e})
    }

})

//frontend sends id and the task is set to 'finished' in the server
app.delete('/', express.urlencoded({ extended: false }), async (req, res) => {
    try{
        const taskid = req.body._id
        let updateResult = await user1.updateOne({_id: ObjectId(taskid)}, {$set: {status:'finished'}})
        return res.status(200).json({_id: taskid, status:'finished'})

    }
    catch(e){
        console.log("delete error: " + e)
        return res.status(404).json({ failure: e })
    }
})

app.delete('/subtask/:taskId/:subtaskId', [express.urlencoded({ extended: false }), paramsToSubtask], async (req,res)=>{
    let {taskId} = req.params
    let {subtaskId} = req.params
    let {loc} = req.body.subtask
    try{
        let removeSubtask = await user1.updateOne(
            {_id: ObjectId(taskId)},
            {$pull:{subtasks:{subtaskId:ObjectId(subtaskId)}}},
            {returnNewDocument:true}
        )
        const subtaskArray = Array.from(removeSubtask.value.subtasks)
        subtaskArray.map(i =>{
            console.log("i.loc is " + i.loc + "and loc is " + loc)
            if(i.loc>loc)
                i.loc-=1
        })
        let updateResult = await user1.updateOne({_id: ObjectId(taskId)},{$set: {subtasks: subtaskArray}})
        return res.status(200).json({subtaskArray})
    }
    catch(e){
        console.log("subtask delete error: " + e)
    }
})

app.listen(3000, () => console.log('server listening on port 3000...'))