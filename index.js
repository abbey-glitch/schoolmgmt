const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer  = require('multer')
// const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();
const dbConn = require("./config/conn");
dbConn();
const Admin = require("./Model/Admin");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const port = process.env.PORT || 3000

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(session({ secret: "secret", 
    resave: false, 
    saveUninitialized: false 
}));
// create the home route
app.get("/", (req, res) => {
    res.send("Hello World!");
})

// create the register route
app.get("/register", (req, res) => {
    res.render("register");
})
// register admin data
app.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedAdmin = await admin.save();
        res.send("Admin added successfully");
    } catch (error) {
        res.send(error);
    }
})
// 
app.get("/login", (req, res) => {
    res.render("login");
})
// login route
app.post("/login", (req, res)=>{
    const email = req.body.email
    const password = req.body.password
    const profile = {
        email:email,
        password:password
    }
    req.session.user = profile
    res.send("user login")
})

// create profile route
app.get("/profile", (req, res) => {
    const user = req.session.user
    if(user){
        res.send(`welcome ${user['email']}`)
    }else{
        res.send("please login first")
    }

    // res.render("profile");
})
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname, "public/content"));

    },
    filename:function(req, file, cb){
        cb(null, file.originalname);
    }
})
const upload = multer({storage:storage})
// display form for upload
app.get("/form/upload", (req, res)=>{
    res.render("upform")
})

// process the form upload
app.post("/form/upload", upload.single("image"), (req, res)=>{
    const imgname = req.file.path
    const imgdesc = req.body.description
    res.send("image uploaded successfully")

})
// logout
app.get("/logout", (req, res)=>{
    session.clear
    res.send("user logout successfully")
})
// make server connection
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})