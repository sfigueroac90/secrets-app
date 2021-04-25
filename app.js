//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const md5 = require("md5")
const bcrypt = require("bcrypt")
const saltRounds = 10;


const app = express();


const secret = process.env.SECRET;
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("User",userSchema);




app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},(err,user)=>{
        if(user){
            bcrypt.compare(password, user.password,function(err,result){
                if(result === true){
                    res.render("secrets")
                }
            })
        }
    })
})

app.get("/register", (req,res) => {
    res.render("register");
})

app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err)=>{
            if (err) {
                console.log(err)
            } else {
                res.render("secrets");
            };
        })


    });
    /*
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    
    */
})

app.listen(3000, ()=>{
    console.log("Listening in port 3000");
});         
