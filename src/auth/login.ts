import type { Context } from "hono";
import { User } from "../../models/User.js";
import {hash} from "bcryptjs";
import {sign } from "hono/jwt";
import dotenv from "dotenv";
dotenv.config();

const exportHandler = async(c:Context) =>{
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
        const token = await sign(payload, process.env.JWT_SECRET);
        return c.json({token});

    }
}