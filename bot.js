// mongodb
const { MongoClient } = require("mongodb")
const { Bot, InlineKeyboard, Keyboard, type } = require("grammy")
const bot = new Bot("6213687651:AAExY3nG0fbuncb4ri3dTME3p9oFUAJTB88")

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
const database = client.db("succwork")

// start user start infos

let refrrelRef = null
let useId = null
let canSendLink = false
let inviter = null


// finsh user start infos


async function connnectToMongodb() {
  await client.connect()
  console.log("connected succssfuly")
}

async function saveUserInfo(id, name, userName) {
  const newUserInfo = { id: id, name: name, userName: userName, refrrel: 0 }
  const usersCollection = await database.collection("users")
  const saveUserInfosToDb = usersCollection.insertOne(newUserInfo)
}






async function addRefrrelForUser(userId) {



  const usersCollection = await database.collection("users")
  const user = await usersCollection.findOne({ id: Number(userId) })
  let userLastRefrrelCount = await user.refrrel
  let addRefrrel = userLastRefrrelCount + 1
  const updateUserRefrrelCount = usersCollection.updateOne({ id: user.id }, { $set: { refrrel: addRefrrel } })

  // console.log(user)
  // console.log("successfully updated")

}

// async function sendMessageForUsers() {
//   await bot.api.sendMessage(954999358, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(5102397897.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(6671953059.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(991466393, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(6228864882.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(6202227379.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(5419606587.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(1003654092, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })
//   await bot.api.sendMessage(5531543181.0, "<b>ربات مجددا در دسترس قرار گرفت یک دنیا سپاس بابت حوصله مندی تان🌹</b>", { parse_mode: "HTML" })

// }



connnectToMongodb()


bot.command("start", async (ctx) => {
  const keyboard = new Keyboard().resized().text("🔍 راهنمایی").text("🔐 دوره رایگان").row().text("💎 کانال نتایج").text("🔗 دعوت دوستان ")
  // sendMessageForUsers()
  await ctx.reply("<b>به دانشگاه موفقیت و کسب و کار احسان نوری خوش آمدید🌹 </b>", { reply_markup: keyboard, parse_mode: "HTML" })


  // give user info
  const userId = Number(parseInt(ctx.chat.id))
  const name = ctx.chat.first_name
  const userName = ctx.chat.username
  const refrrelRef = await ctx.match

  // save inviter id 

  if (ctx.match) {
    inviter = await ctx.match
  } else {

  }


  // save user infos

  // saveUserInfo(userId, name, userName)

  // cheak if we have the same id in db
  const usersCollection = await database.collection("users")
  const searchUser = await usersCollection.findOne({ id: userId })

  if (searchUser) {
    console.log("we have the same id in database.")
  } else {
    saveUserInfo(userId, name, userName)
  }


  if (refrrelRef) {
    const isInDatabase = await usersCollection.findOne({ id: Number(userId) })
    if (isInDatabase) {
      console.log('this user is invited and there is no refrrel for you.')
      bot.api.sendMessage(Number(refrrelRef), "این کاربر از قبل دعوت شده است.")
    } else {
      addRefrrelForUser(refrrelRef)
      bot.api.sendMessage(userId, `<b> شما از طرف آیدی${refrrelRef} دعوت شدید.</b>`, { parse_mode: "HTML" })

      //cheak how many refrrel i need for link chanel
      const userInfos = await usersCollection.findOne({ id: Number(refrrelRef) })
      let userRefrrelCount = await userInfos.refrrel

      bot.api.sendMessage(refrrelRef, `فقد  ${5 - Number(userRefrrelCount.refrrel)} نفر تا لینک دوره رایگان `, { parse_mode: "HTML" })


    }

  } else {
    console.log("without invite")
  }
})



bot.on("message", async (ctx) => {

  if (ctx.message.text === "/start") {
    ctx.reply("")
  }
  if (ctx.message.text === "🔍 راهنمایی") {
    ctx.reply(`<b>برای اینکه دوره رایگان را دریافت کنید لطفا از قسمت دعوت دوستان حداقل ۵ نفر را دعوت کنید تا لینک دوره رایگان برایتان ارسال شود</b>`, { parse_mode: "HTML" })
  } else if (ctx.message.text === "🔐 دوره رایگان") {
    const usersCollection = await database.collection("users")
    const user = await usersCollection.findOne({ id: ctx.chat.id })
    const userRefrrelCount = await user.refrrel
    console.log(userRefrrelCount)
    if (userRefrrelCount === 5 || userRefrrelCount > 4) {
      ctx.reply("لینک دوره رایگان:https://t.me/succwork", { parse_mode: "HTML" })
    } else {
      ctx.reply("<b>لطفاحداقل ۵ نفر را دعوت کنید تا لینک کانال برای شما ارسال شود🌹.</b>", { parse_mode: "HTML" })
    }
    // if(usersCollection === 5){
    //   
    // }else{
    //   console.log(inviter)
    //   ctx.reply("<b>لطفاحداقل ۵ نفر را دعوت کنید تا لینک کانال برای شما ارسال شود🌹.</b>" , {parse_mode:"HTML"})
    // }
  } else if (ctx.message.text === "🔗 دعوت دوستان") {
    ctx.reply(`<b>https://t.me/succwork_bot?start=${ctx.chat.id}</b>`, { parse_mode: "HTML" })
  } else if (ctx.message.text === "💎 کانال نتایج") {
    ctx.reply(`<b>🔵برای دیدن نتایج دوره ها روی لینک زیر کلیک کنید ↙️
https://t.me/results02</b>` , { parse_mode: "HTML" })
  }
})



bot.start()
