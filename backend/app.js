const express = require('express')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const { MongoError } = require('mongodb')
const dotenv = require('dotenv');
const {OAuth2Client} = require('google-auth-library');
dotenv.config();
const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return userid;
  }


let database;
const uri = "mongodb+srv://admin:" + process.env.SECRET_KEY + "@mflix.5cbzlet.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);
mongoClient.connect().then((r) =>{
    database = mongoClient.db('Todo');
})
      
async function initUserCollection(userId) {
    try {
      // Check if collection exists
      const collections = await database.listCollections().toArray();
      const collectionExists = collections.some((collection) => collection.name === userId);
  
      if (!collectionExists) {
        // Create new collection
        await database.createCollection(userId);
    }
  
    } catch (e) {
      console.error(e);
    }
}

async function initGuestCollection() {
    let collectionName = '114276218204370969645';
    const randomString = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    const newCollectionName = `${randomString}_${new ObjectId().toString()}`; // add ObjectId to ensure unique name
  
    const originalCollection = database.collection(collectionName);
    originalCollection.aggregate([{ $match: {} }, { $out: newCollectionName }]).next();
  
    setTimeout(async () => {
      const newCollection = database.collection(newCollectionName);
      await newCollection.drop();
    }, 2 * 60 * 60 * 1000); // delete the collection after 2 hours
  
    return newCollectionName;
  }

async function connectToCollection(userId) {
    return database.collection(userId);
}
function setHeaders(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, m_id, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}

app.use('/', setHeaders);
app.use('/', express.json());


app.get('/', (req, res) => {
    try {
        return res.status(200).json({status: "it works"});
    }
    catch (e) {
        console.log("get error: " + e)
        return res.status(404).json({ status: "get error" })
    }
})   
//gets all live tasks from server
app.get('/tasks', async (req, res) => {
    try {
        let collection = await connectToCollection(req.headers.m_id);
        let allTasks = await collection.find({}).toArray();
        return res.status(200).json(allTasks);
    }
    catch (e) {
        console.log("get error: " + e)
        return res.status(404).json({ status: "get error" })
    }
})

app.post('/auth', async (req, res) => {
    try {
        let id = await verify(req.body.credential).catch(console.error);
        await initUserCollection(id);
        return res.status(200).json({status: 'it worked',
        id});
    }
    catch (e) {
        console.log("auth error: " + e);
        return res.status(404).json({ status: "post error" });
    }
})

app.get('/testlogin', async (req, res) => {
    try {
        let id = await initGuestCollection();
        return res.status(200).json({status: 'it worked',
        id});
    }
    catch (e) {
        console.log("auth error: " + e);
        return res.status(404).json({ status: "post error" });
    }
})

app.post('/', async (req, res) => {       
    let task = req.body;
    let {name, desc, due, priority, maxPriority, estimatedTime, switchTimes} = task;
    try {
        let collection = await connectToCollection(req.headers.m_id);
        let insertResult = await collection.insertOne(
            {name, desc, due, priority, maxPriority, estimatedTime, switchTimes});
        return res.status(200).json({ _id: insertResult.insertedId});
    }
    catch (e) {
        console.log('task add to db failed');
        return res.status(404).json({ failure: e });
    }
})

app.delete('/', async (req, res) => {
    try{
        let collection = await connectToCollection(req.headers.m_id);
        let deleteResult = await collection.deleteOne({_id: ObjectId(req.body.id)});
        return res.status(200).json({status:'finished'});
    }
    catch(e){
        console.log("delete error: " + e);
        return res.status(404).json({ failure: e });
    }
})

app.listen(3000, () => console.log('server listening on port 3000...'))