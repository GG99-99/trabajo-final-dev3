import './env.js'
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import express from "express";
import { createServer } from 'http'
import { exec } from 'child_process'
import { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger/swagger.config.js'


/***********************************
|   00. CARGAR DATA SEEDS EN LA DB  |
 ***********************************/
import { mainSeeder } from "./seeder/seeder.js";
try {
  await mainSeeder()
} catch (e) {
  console.warn('[seeder] skipped:', (e as Error).message)
}

// -------------------------------------------------------- //
import { errorHandler } from "./handlers/errorHandler.js";
import { router as apiRouter } from "./api.router.js";
import { initSocketIO } from "./modules/socket/socket.service.js";
import { auditMiddleware } from "./middlewares/audit.middleware.js";


/*****************************
|   Abrir URL en navegador   |
 *****************************/
function openBrowser(url: string) {
  const cmd =
    process.platform === 'win32'  ? `start "" "${url}"` :
    process.platform === 'darwin' ? `open "${url}"` :
                                    `xdg-open "${url}"`
  exec(cmd, (err) => {
    if (err) console.warn('[swagger] No se pudo abrir el navegador:', err.message)
  })
}


const app = express()
const httpServer = createServer(app)
const PORT = Number(process.env.PORT) || 3030


/*******************
|   1. MIDDLEWARES  |
 *******************/
app.use(cors({
  origin: (origin, callback) => {
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


app.get('/', (_req: Request, res: Response) => {
  res.send("El servidor del trabajo final esta funcionando")
})

/*******************
|   2. SWAGGER UI   |
 *******************/
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Obsidian — API Docs',
  })
)

app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

/******************
|   ROUTER OF API  |
 ******************/
app.use('/api', auditMiddleware)
app.use('/api', apiRouter)

/******************
|   ERROR HANDLER  |
 ******************/
app.use(errorHandler)

/*********************
|   SOCKET.IO SETUP  |
 *********************/
initSocketIO(httpServer)


httpServer.listen(PORT, '0.0.0.0', () => {
  const swaggerUrl = `http://localhost:${PORT}/api-docs`
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📄 Swagger UI en ${swaggerUrl}`)
  openBrowser(swaggerUrl)
})
