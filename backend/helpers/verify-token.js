import jwt from 'jsonwebtoken'

import getToken from './get-token.js'

//middleware to validate token
const checkToken = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).json({message: 'Acess denied - headers'})
    }

    const token = getToken(req)

    if(!token) {
        return res.status(401).json({ message: 'Acess denied' })
    }

    try {
        const verified = jwt.verify(token, 'oursecret')
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token'})
    }

}

export default checkToken