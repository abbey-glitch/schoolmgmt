const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());
app.use(session({ secret: "secret", 
    resave: true, 
    saveUninitialized: true 
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
// login route
app.post("/login", async(req, res)=>{
    fname = req.body.fname
    password = req.body.password
    profile = {
        fname: fname,
        password: password
    }
    req.session.user = profile
    res.send("Login successful")
})

// make server connection
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})