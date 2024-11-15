//@ts-ignore

import createUserToken from '../helpers/create-user-token.js'
import getToken from '../helpers/get-token.js'
import getUserByToken from '../helpers/get-user-by-token.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export default class UserController {

static async register(req, res){

    const { name, email, phone, password, confirmpassword } = req.body
    
    //validations
    if(!name) {
        res.status(422).json({message: 'Name required'})
        return
    }
    if(!email) {
        res.status(422).json({message: 'Email required'})
        return
    }
    if(!phone) {
        res.status(422).json({message: 'Phone required'})
        return
    }
    if(!password) {
        res.status(422).json({message: 'Password required'})
        return
    }
    if(!confirmpassword) {
        res.status(422).json({message: 'Please confirm your password'})
        return
    }

    if(password !== confirmpassword){
        res.status(422).json({message: 'The passwords need to be the same'})
    }

    //check if user exists
    const userExists = await User.findOne({email: email})
    
    if(userExists) {
        res.status(422)
        .json({
            message: 'This email already has an account'
        })
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create a user
    const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: passwordHash,
    })

    try {
        const newUser = await user.save()
      
        await createUserToken(newUser, req, res)
        } catch (error) {
        res.status(500).json({message: error})
        }
    }

    static async login(req, res) {
        const {email, password}= req.body

        if(!email) {
            res.status(422).json({message: 'Email required'})
            return
        }
        if(!password) {
            res.status(422).json({message: 'Password required'})
            return
        }

         //check if user exists
        const user = await User.findOne({email: email})
    
        if(!user) {
            res.status(422)
         .json({
                message: 'This email is not resgistered'
         })
         return
         }

         //check if password match with db password
         const checkPassword = await bcrypt.compare(password, user.password)

         if(!checkPassword) {
            res.status(422).json({
                message: 'Invalid password'
            })
            return
         }

         await createUserToken(user, req, res)
    }

    static async checkUser(req, res){
        let currentUser

        console.log(req.headers.authorization)
        
        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, 'oursecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json({
                message: 'User not find'
            })
            return
        }

        res.status(200).json({user})
    }

    static async editUser(req, res) {
        const id = req.params.id
        //check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body
        let image = ''

        if(req.file) {
            user.image = req.file.filename
        }

        //validations
        if(!name) {
            res.status(422).json({message: 'Name required'})
            return
        }

        user.name = name

        if(!email) {
            res.status(422).json({message: 'Email required'})
            return
        }
        
        //check if email was already taken
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists) {
            res.status(422).json({
                message: 'Please enter another email'
            })
            return
        }
        user.email = email

        if(!phone) {
            res.status(422).json({message: 'Phone required'})
            return
        }
        
        user.phone = phone

        if (password != confirmpassword){
            res.status(422).json({message: 'The passwords need to be the same'})
            return
        } else if(password === confirmpassword && password != null) {
            //creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            //return user updated data
             await User.findOneAndUpdate(
                {_id: user.id },
                { $set: user },
                {new: true},
            )

            res.status(200).json({message: 'User updated'})
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
} 