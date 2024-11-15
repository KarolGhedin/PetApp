import multer from 'multer'
import path from 'path'

//destination to store the images
const imageStorage = multer.diskStorage({
    destination : function (req, file, cb) {
        let folder = ""

        if(req.baseUrl.includes("users")){
            folder = "users"
        }else if (req.baseUrl.includes("pets")){
            folder = "pets"
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + 
        String(Math.floor(Math.random() * 100)) + 
        path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Please send just jpg or png files"))
        } 
    cb(undefined, true)
    },
})

export default imageUpload 