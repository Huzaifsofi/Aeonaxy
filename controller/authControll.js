const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtkey = process.env.JWTKEY
const { Resend } = require('resend')

const resend = new Resend('re_H8a4uyN5_5zav33KGSU86AZifVfa2PhJk');

const generateEmail = async (req, res) => {
    const { email } = req.body;

    const payload = {
        email: email
    }
    try {
        const emailtoken = await jwt.sign(payload, 'ourSecretKey', { expiresIn: '10m' });

        const chek = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [`${email}`],
            subject: 'verify your email',
            text: `your email key is: ${emailtoken}`,
          });

          console.log(chek)
        res.status(200).json({ 'message': 'check email to verify' });
    } catch (error) {

        console.error('Error generating email token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const verifyEmail = (req, res, next) => {
    const id = req.params.id;

    console.log(id)

    if (id) {
        jwt.verify(id, 'ourSecretKey', (err, decoded) => {
            if (err) {
                return res.json({
                    isLoggedIn: false,
                    message: "incorrect verifaticon"
                })
            }
            req.user = {};
            req.user.email = decoded.email
            next()
        })
    } else {
        return res.status(400).json({ 'message': 'incorrect verifaticon' })
    }
}

const Signup = async (req, res) => {
    const { name, password } = req.body;
    const profile = req.file.filename;

    const email = req.user.email;

    console.log(email)

    let logindatas;
    const role = "user"
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
    //return res.status(201).json({ 'message': logindatas })
    return res.status(201).json({ 'message': 'account created' })
}

const login = async (req, res) => {
    const { email, password } = req.body;

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


const passwordReset = async (req, res) => {
    const { password } = req.body;
    let datas;

    const email = req.user.email;

    const hasedpasswprd = await bcrypt.hash(password, 10)

    try {
        datas = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hasedpasswprd
            }
        })
    } catch (err) {
        console.log(err)
    } 
    if (!datas) {
        return res.status(404).json({ 'message': 'unable to signup' })
    }
    return res.status(201).json({ 'message': datas })
    //return res.status(201).json({ 'message': 'account created' })
}

const checkuser = (req, res) => {
    res.json({ isLoggedIn: true, name: req.user.name })
}

exports.Signup = Signup;
exports.login = login;
exports.verifyjwt = verifyjwt;
exports.checkuser = checkuser;

exports.generateEmail = generateEmail;
exports.verifyEmail = verifyEmail;
exports.passwordReset = passwordReset;
