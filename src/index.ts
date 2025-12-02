import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import registerHandler from './auth/register.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
connectDB();

const app = new Hono()
// const fun = async()=>{
//   const user = await User.deleteMany();
//   console.log(user);
// }
// fun();

app.post('/login', (c) => {
  return c.text('You are logged in!')
})

// app.post('/register', (c) => {
//   return c.text('You are Register, welcome!')
// })

app.post('/register', registerHandler);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app;
