import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from './routes/api/users.js';

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.use('/users', userRouter)

app.get('/', async(req, res) => {
    res.json({message: 'Hello World!'})
})