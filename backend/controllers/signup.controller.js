const userModel = require('../models/users.model.js')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const generateJWT = require('../utils/generateJWT.utils.js')
const sendWelcomeMail = require(`../mail/resend.mail.js`)

dotenv.config()

const signup = async(req,res)=>{

    const { name, email, password } = req.body
    const requiredBody = z.object({
        name: z.string().min(3).max(100),
        email: z.string().min(10).max(100).email(),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(50, { message: "Password must be at most 50 characters long" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/\d/, { message: "Password must contain at least one number" })
            .regex(/[\W_]/, { message: "Password must contain at least one special character" })
    });
    
    const isParsedWithSuccess = requiredBody.safeParse(req.body)
    if(! isParsedWithSuccess.success){
        return res.status(400).json({
            success: false,
            message: `Please provide input values in correct format`
        })
    }

    const userExists = await userModel.findOne({
        email
    })

    if(userExists){
        return res.status(409).json({
            success: false,
            message: `User already exists`
        })
    }

    const hashedPassword = await bcrypt.hash(password,7)

    try{
        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        const token = generateJWT(newUser._id, '15d')

        sendWelcomeMail(email, name)
        
        let cookieOptions = {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            httpOnly: true,
            secure: true,
            path: '/',
        };

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.domain = 'checkpoint-fjy6.onrender.com';
        }

        return res
        .cookie("token", token, cookieOptions)
        .status(201)
        .json({
            name: newUser.name,
            email: newUser.email,
            success: true,
            message: 'You are signed up',
            token,
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: `${err}, Server error`
        })
    }
}

module.exports = signup