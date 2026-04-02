import express from "express";
import { Request, Response } from "express";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; 


/***********************************
|   00. CARGAR DATA SEEDS EN LA DB  |
 ***********************************/
import { mainSeeder } from "./seeder/seeder.js";
await mainSeeder()

// -------------------------------------------------------- //
import { errorHandler } from "./handlers/errorHandler.js";
import { router as appRouter } from "./app.router.js";



const app = express()
const PORT = Number(process.env.PORT) || 3030


/*******************
|   1. MIDDLEWARES  |
 *******************/
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
app.use('/api', appRouter)

/******************
|   ERROR HANDLER  |
 ******************/
app.use(errorHandler)


app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Running on http://localhost:${PORT}`)
})