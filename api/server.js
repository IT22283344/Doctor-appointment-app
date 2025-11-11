const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const colors=require('colors')
const morgan=require('morgan')

dotenv.config()

const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to MonogoDB successfully` .bgCyan.white)
    }catch(error){
        console.log(`error in connection db ${error}`.bgRed.white)
    }
}
const app=express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
connectDB();

app.get("",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to Full Stack App",
    })
});
// ensure there is a JWT secret for development if none provided
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

const PORT=process.env.PORT||8080;

app.use("/api/auth",require("./routes/user.route"))
// add auth routes (protected homepage)
app.use("/api", require("./routes/auth.route"))
//app.use("/api/posts",require("./routes/booking.route"))
//app.use("/api/doctors",require("./routes/doc.route"))

app.listen(PORT,()=>{
    console.log(`server running ${PORT}`.bgGreen.white)
})