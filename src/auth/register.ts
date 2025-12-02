import type { Context, Next } from 'hono';
import  nodemailer  from 'nodemailer';
import { Redis } from 'ioredis'; //brew services start redis, brew services stop redis, redis-cli FLUSHALL(erase data)
import otpGenerator  from 'otp-generator';
import dotenv from "dotenv";
import {hash} from "bcryptjs";
import { User } from '../../models/Models.js';

dotenv.config();

const redis = new Redis();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS 
    }
})

const registerHandler = async(c: Context, next: Next) => {
    const { email, password, otp } = await c.req.json()

    if (!email) {
        return c.json({ message: "Email is required" }, 400);
    }

    if (!otp){
        const otp: string = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        console.log(`Otp Generated for this ${email} otp: ${otp}`)
        try {
            await redis.set(email, otp, 'EX', 300);
            await transporter.sendMail({
                from: "Enchanced-AI-Chat-Desktop-Client",
                to: email,
                subject: 'Verification Code',
                html: `
                    <h3>Hello!</h3>
                    <p>Your verification code is: <b>${otp}</b></p>
                    <p>This code expires in 5 minutes.</p>
                `
    
            })
            return c.json({message: "OTP sent successfully."}, 201)
        }catch (err){
            console.log(err)
            return c.json({message: "fas gya mamla......"}, 500)
        }
    }else{
        const storedOtp = await redis.get(email);
        if (!storedOtp){
            return c.json({message: "OTP expired or invalid"}, 400)
        }
        if (storedOtp !== otp){
            return c.json({message: "dubara kosis kr oyeeee"}, 400)
        }
        
        let hashPass;
        try{
            hashPass = await hash(password, 10);
            console.log("hashed Pass: ", hashPass);
            
        }catch(err){
            console.log(`Error while hashing: ${err}`);
        }
        
        try{
            const user = await User.findOne({email:email});
            if(user){
                return c.json({success:false, error:"User already exist, go to login page."})
            }
            await User.create({email:email, password:hashPass})
            await redis.del(email)
            return c.json({success:true, message: "User Created successfully!"})

        }catch(err){
            console.log(`Error adding user in database: ${err}`)
            return c.json({success:false, message: `Error adding user in database: ${err}` }, 500)
        }
    }
}


export default registerHandler; 