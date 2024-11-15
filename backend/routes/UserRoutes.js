import express from "express";
import UserController from '../controllers/UserController.js'
import imageUpload from '../helpers/image-upload.js'

//middleware
import verifyToken from '../helpers/verify-token.js'


const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser)

export default router