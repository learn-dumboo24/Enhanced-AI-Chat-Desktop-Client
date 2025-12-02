import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import registerHandler from './auth/register.js';
const app = new Hono()



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
