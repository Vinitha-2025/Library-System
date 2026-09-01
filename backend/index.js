const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
require("dotenv").config()

const app=express()
app.use(cors())
app.use(express.json())

// const book=[{title:"CSS",author:"Smith",price:200,category:"Programming",available:"Yes"},{title:"JS",author:"Sruthi",price:600,category:"Other",available:"No"}]
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("DB Connected");
    } catch (err) {
        console.log("Failed to connect", err.message);
    }
}

connectDB();
// mongoose.connect(process.env.MONGO_URL)
// .then(function(){
//     console.log("DB Connected")
// }) .catch(function(err){
//     console.log("Failed to connect",err.message)
// })

const Books=mongoose.model("Books",
    {title:String,author:String,category:String,price:Number,
        available:String},"books")

app.post("/addlist", function(req,res){

    var newbook = req.body.newbook

    const newBook = new Books({
        title:newbook.title,
        author:newbook.author,
        price:newbook.price,
        category:newbook.category,
        available:newbook.available
    })

    newBook.save().then(function(savedBook){
        console.log("Saved")

        res.send({
            status:"success",
            message:"Book added successfully",
            book:savedBook
        })

    }).catch(function(err){
        res.send({
            status:"error",
            message:err.message
        })
    })
})

app.put("/updatelist/:id",function(req,res){
    var bookId=req.params.id
    var updatedbook=req.body.newbook
    
    Books.findByIdAndUpdate(bookId,{
        title:updatedbook.title,
        author:updatedbook.author,
        price:updatedbook.price,
        category:updatedbook.category,
        available:updatedbook.available
    }).then(function(){
        console.log("Updated")
        res.send({status:"success",message:"Book updated successfully"})
    }).catch(function(err){
        res.send({status:"error",message:err.message})
    })
})

app.delete("/deletelist/:id",function(req,res){
    var bookId=req.params.id
    
    Books.findByIdAndDelete(bookId).then(function(){
        console.log("Deleted")
        res.send({status:"success",message:"Book deleted successfully"})
    }).catch(function(err){
        res.send({status:"error",message:err.message})
    })
})

app.get("/booklist",function(req,res){
    Books.find().then(function(retdata){
        res.send(retdata)
        console.log(retdata)
    })
})



app.listen(5000,function(){
    console.log("Server Started")
})

module.exports=app