const express = require('express')
const bodyParser = require('body-parser')
const authRouter = require('./routes/userAuth.js')
const passwordRouter = require('./routes/forgotPassword.js')
const taskRouter = require('./routes/taskAuth.js')
const storyRouter = require('./routes/storyAuth.js')
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const Port = process.env.PORT || 3000;
const dotenv = require('dotenv')

const app = express();
dotenv.config();

app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/auth",authRouter);
app.use("/api/password",passwordRouter);
app.use("/api/task",taskRouter)
app.use("/api/story",storyRouter)

app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFileSync('log.txt',reqString,{flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    })
    next();
})

app.use((err,req,res,next)=>{
    const errorString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFileSync('error.txt',errorString,{flag:'a'},(err)=>{
        if(err){
            console.log(err)
        }
    })
    res.status(500).send("Something Went Wrong");
    next();
})

app.listen(Port,()=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>{
        console.log("DB Connected")
    })
    .catch((err)=>{
        console.log(err)
    })
    console.log(`Server Started at post ${Port}`)
})