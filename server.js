const express = require('express')

const connectDB = require('./config/db')
const authRouter = require('./routes/api/auth')
const postRouter = require('./routes/api/post')
const profileRouter = require('./routes/api/profile')
const userRouter = require('./routes/api/user')
const path = require('path')

const app = express()

//connect Database
connectDB()

//For parsing body
app.use(express.json( {extended: false} ))

//using express routers
app.use(authRouter)
app.use(postRouter)
app.use(profileRouter)
app.use(userRouter)

//SERVER static assets in production
if(process.env.NODE_ENV === 'production'){
    //set static folder 
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
const PORT = process.env.PORT || 5000


app.get("/", (req, res) => {
    res.send("Running")
})

app.listen(PORT, () => {
    console.log("Server started on PORT ", PORT)
})