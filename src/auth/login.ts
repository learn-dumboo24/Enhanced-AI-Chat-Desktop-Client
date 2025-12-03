import type { Context } from "hono";
import { AuthProvider, User } from "../../models/Models.js";
import {hash} from "bcryptjs";
import {sign } from "hono/jwt";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const loginHandler = async(c:Context) =>{
    try{
        const body = await c.req.json();
        const {email,password} = body;
        const user = await User.findOne({email});
        if(!user){
            return c.json({success:false, error:"Email doesn't exist."}, 401);
        }

        const passMatch = await bcrypt.compare(password, user.password);

        if(!passMatch){
            return c.json({success:false, error:"Wrong Password"},401);
        }

        const payload = {
            id: user._id,
            exp: Math.floor(Date.now()/1000) + 86400
        }
        const token = await sign(payload, process.env.JWT_SECRET!);
        const tokenExpiresAt = new Date(Date.now() + 86400 * 1000 * 30);

        const authProvider = await AuthProvider.create({
            provider:"password",
            userId: user._id,
            accessToken: token,
            tokenExpiresAt
        })

        user.authProviders.push(authProvider._id);
        await user.save();

        return c.json({
            success:true,
            accessToken: token,
            providerId: authProvider._id,
            expiresAt: tokenExpiresAt
        });

    }catch(err){
        return c.json({
            success: false,
            error: `Login Issue: ${err}`
        },500);
    }
}

export default loginHandler;