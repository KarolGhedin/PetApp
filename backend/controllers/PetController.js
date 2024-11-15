import mongoose from 'mongoose'

import getToken from '../helpers/get-token.js'
import getUserByToken from '../helpers/get-user-by-token.js'
import Pet from '../models/Pet.js'

const ObjectId = mongoose.Types.ObjectId

export default class PetController {

    //create a pet
    static async create(req, res) {
        const {name, age, weight, color } = req.body

        const images = req.files
        const available = true

    //images upload

    //validation
        if(!name){
            res.status(422).json({message: "The name is required"})
            return
        }
        if(!age){
            res.status(422).json({message: "The age is required"})
            return
        }
        if(!weight){
            res.status(422).json({message: "The weight is required"})
            return
        }
        if(!color){
            res.status(422).json({message: "The color is required"})
            return
        }
        if(images.length === 0){
            res.status(422).json({message: "The image is required"})
            return
        }


        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user:{
                _id: user.id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({message: 'Pet saved', newPet})
            
        } catch (error) {

            res.status(500).json({message:error})
        }

    }

    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createAt')

        res.status(200).json({pets: pets,})
    }

    static async getAllUserPets(req, res){
        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const pets = await Pet.find({'user._id': user.id}).sort('-createAt')
        res.status(200).json({
           pets,
        })
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user.id}).sort('-createAt')

        res.status(200).json({
            pets
        })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        //check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Invalid ID'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({ message: 'Pet was not finded'})
        }

        res.status(200).json({
            pet: pet
        })
    }

     static async removePetById(req, res) {
         const id = req.params.id

        //check if id is valid
         if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'Invalid ID'})
            return
         }

         
         const pet = await Pet.findOne({_id: id})
         if(!pet) {
            res.status(404).json({ message: 'Pet was not finded'})
            return
        }

        //check pet user
        
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message: 'Oops, there is a problem, please try again.'
            })
            return
        }

        await Pet.findByIdAndDelete(id)
        res.status(200).json({message: 'Pet removed'})

     }

     static async updatePet(req, res) {
        const id = req. params.id
        const {name, age, weight, color, available } = req.body
        const images = req.files
        const updateData = {}

        //check if pet exists
        const pet = await Pet.findOne({_id: id})

         if(!pet) {
            res.status(404).json({ message: 'Pet was not finded'})
            return
        }

        //check pet user
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({
                message: 'Oops, there is a problem, please try again.'
            })
            return
        }

        //validation
        if(!name){
            res.status(422).json({message: "The name is required"})
            return
        }else {
            updateData.name = name
        }
        if(!age){
            res.status(422).json({message: "The age is required"})
            return
        }else{
            updateData.age = age
        }
        if(!weight){
            res.status(422).json({message: "The weight is required"})
            return
        } else {
            updateData.weight = weight
        }
        if(!color){
            res.status(422).json({message: "The color is required"})
            return
        } else {
            updateData.color = color
        }
        if(images.length > 0) { 
            updateData.images = []
            images.map((image) => {
                updateData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updateData)

        res.status(200).json({message: 'Pet updated'})

     }

     static async schedule(req, res) {
        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({ _id: id })

         if(!pet) {
            res.status(404).json({ message: 'Pet was not finded'})
            return
        }

        //check the user pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() === user._id.toString()) {
            res.status(422).json({
                message: 'you can not adopt your own pet.'
            })
            return
        }

        //check if already has a schedule

        if (pet.adopter) {
            if(pet.adopter._id.toString() === user._id.toString()) {
                res.status(422).json({
                    message: 'you already have a scheduled visit.'
                })
                return
            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `The visit was scheduled, get in touch with ${pet.user.name} by the phone number : ${pet.user.phone}`
        })
     }   

     static async concludeAdoption (req, res) {
        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({ _id: id })

         if(!pet) {
            res.status(404).json({ message: 'Pet was not finded'})
            return
        }

       //check the pet user owner
       const token = getToken(req)
       const user = await getUserByToken(token)

       if (pet.user._id.toString() !== user._id.toString()) {
           res.status(422).json({
               message: 'you can not acess this solicitation.'
           })
           return
       }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Congrats and cheers, your pet has a new owner.'
        })

     }
}