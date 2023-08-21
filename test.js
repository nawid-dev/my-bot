const { MongoClient, ConnectionCheckedInEvent } = require("mongodb");
const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
const database = client.db("succwork")

async function connnectToMongodb (){
    await client.connect()
   

    const usersCollection = await database.collection("users")
    const user = await usersCollection.findOne({id : 5419606587.0})
    const userLastRefrrelCount = user.refrrel
    let updateRefrrelCount = Number( userLastRefrrelCount) + 1
    usersCollection.updateOne({id: user.id} , {$set : {refrrel :updateRefrrelCount }})


}

connnectToMongodb()