import type { Context } from "hono";
import { AuthProvider } from "../../models/Models.js";

const logoutHandler = async (c:Context) =>{
    const token = c.req.header("authorization")?.replace("Bearer ", "");
    if(!token){
        return c.json({
            success: false,
            error: "Missing token"
        }, 401);
    }
    await AuthProvider.deleteOne({accessToken: token});
    return c.json({
        success: true,
        message: "User Logged Out Successfully"
    });
}
export {logoutHandler};