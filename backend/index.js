import express from "express";
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
import PetRoutes from './routes/PetRoutes.js'

const app = express()

//config json res
app.use(express.json())

//solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

//public folder for images
app.use(express.static('public'))

//routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000)