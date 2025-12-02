import type { Context, Next } from 'hono';

const validation = async(c: Context, next: Next): Promise<Response | void> => {
    const {email, password} = await c.req.json()
    if (!email || !email.trim() || !password || !password.trim()){
        return c.text('All fields are required', 401);
    }
    await next()
}

export default validation;