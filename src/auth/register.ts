import type { Context, Next } from 'hono';
import  nodemailer  from 'nodemailer';
import { Redis } from 'ioredis'; //brew services start redis, brew services stop redis, redis-cli FLUSHALL(erase data)
import otpGenerator  from 'otp-generator';

const redis = new Redis();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', //mai nhi bataunga 
        pass: '' // hehe
    }
})

const registerHandler = async(c: Context, next: Next) => {
    const { email, otp } = await c.req.json()

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
        await redis.del(email)
        
        return c.json({
            message: "You are Verified!"
        })
    }
}


export default registerHandler;