const express = require('express')
const route = express.Router()
const multer = require('multer')

const AuthRoute = require('../controller/authControll')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/'); // Destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // File naming
    }
});

const upload = multer({
    storage: storage,
});


route.get('/signup/:id', AuthRoute.verifyEmail ,upload.single('profile') , AuthRoute.Signup)
route.post('/login', AuthRoute.login)
route.get('/check', AuthRoute.verifyjwt, AuthRoute.checkuser)

route.post('/generateemail', AuthRoute.generateEmail)
route.post('/passwordreset/:id', AuthRoute.verifyEmail, AuthRoute.passwordReset)

module.exports = route;