import jwt from 'jsonwebtoken'

import User from '../models/User.js'

//get user by jwt token
const getUserByToken = async (token) => {
    //validate token
    if(!token) {
        return res.status(401).json({message: 'token not valid'})
    }

    const decoded = jwt.verify(token, 'oursecret')
    const userId = decoded.id
    const user = await User.findOne({_id: userId})

    return user
}

export default getUserByToken