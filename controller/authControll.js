const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtkey = process.env.JWTKEY

const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    const profile = req.file.filename;

    console.log(name, " ",  email, " ",  password)
    console.log(profile)

    let logindatas;
    const role = "admin"
    try {

        if (!name || !email || !password) {
            return res.status(400).json({ 'message': 'please add all fields' })
        }
    
        if (password.length <  6) {
            return res.status(400).json({ 'message': 'password is too weak' })
        }
    
        const checkexistemail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
    
        if (checkexistemail) {
            return res.status(400).json({ 'message': 'email already exist' })
        }

        const hasedpasswprd = await bcrypt.hash(password, 10)

        logindatas = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hasedpasswprd,
                profile: profile,
                role: role
            }
        })

    } catch (err) {
        console.log(err)
    }
    if (!logindatas) {
        return res.status(404).json({ 'message': 'unable to signup' })
    }
    return res.status(201).json({ 'message': 'account created' })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)

    try {
        const checkexistemail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
    
        if (!checkexistemail) {
            return res.status(400).json({ 'message': 'email is not' })
        }
    
        const checkpassword = await bcrypt.compare(password, checkexistemail.password)
    
        if (!checkpassword) {
            return res.status(400).json({ 'message': 'password incorrect' })
        } else {
            const payload = {
                id: checkexistemail.id,
                name: checkexistemail.name,
            }
    
            jwt.sign(payload, jwtkey, {expiresIn: 86400}, (err, token) => {
                if (err) {
                    return res.json({ 'message': err })
                }
                return res.json({ 
                    message: "Sucess",
                    token: "Bearer " + token
                });
            })
        }

    } catch (err) {
        console.log(err)
    }

}

const verifyjwt = (req, res, next) => {
    const token = req.headers["x-access-token"]?.split(' ')[1]
    console.log(token)

    if (token) {
        jwt.verify(token, jwtkey, (err, decoded) => {
            if (err) {
                return res.json({
                    isLoggedIn: false,
                    message: "Field To Authenticate"
                })
            }
            req.user = {};
            req.user.id = decoded.id
            req.user.name = decoded.name
            next()
        })
    } else {
        return res.status(400).json({ 'message': 'token not found' })
    }
}

const checkuser = (req, res) => {
    res.json({ isLoggedIn: true, name: req.user.name })
}

exports.Signup = Signup;
exports.login = login;
exports.verifyjwt = verifyjwt;
exports.checkuser = checkuser;