import type { Context, Next } from "hono";
import {verify} from "hono/jwt";
import { AuthProvider } from "../../models/Models.js";
import { error } from "console";

const authMiddleware = async(c:Context, next:Next)=>{
    try{
        const header = c.req.header("authorization");
        if(!header){
            return c.json({
                success:false, 
                error: "Missing authorization header"
            }, 401);
        }

        const token = header.replace("Bearer ", "");
        if(!token){
            return c.json({
                success:false,
                error: "Missing token"
            })
        }

        const payload = await verify(token, process.env.JWT_SECRET!);

        const provider = await AuthProvider.findOne({accessToken:token});
        if(!provider){
            return c.json({
                success:false,
                error: "Token revoked or expired"
            }, 401)
        }

        c.set("userId", payload.id);
        c.set("providerId", provider._id);
        await next();

    }catch(err){
        return c.json({
            success:false,
            error: "Unauthorized"
        }, 401);
    }
}

export {authMiddleware};
