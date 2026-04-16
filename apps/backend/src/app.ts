import express from "express";
import { Request, Response } from "express";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';


/***********************************
|   00. CARGAR DATA SEEDS EN LA DB  |
 ***********************************/
import { mainSeeder } from "./seeder/seeder.js";
await mainSeeder()

// -------------------------------------------------------- //
import { errorHandler } from "./handlers/errorHandler.js";
import { router as apiRouter } from "./api.router.js";



const app = express()
const PORT = Number(process.env.PORT) || 3030


/*******************
|   1. MIDDLEWARES  |
 *******************/
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl) or any localhost port
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))


app.get('/', (req: Request, res: Response) => {
    res.send("El servidor del trabajo final esta funcionando")
})

/******************
|   ROUTER OF API  |
 ******************/
app.use('/api', apiRouter)

/******************
|   ERROR HANDLER  |
 ******************/
app.use(errorHandler)


app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Running on http://localhost:${PORT}`)
})