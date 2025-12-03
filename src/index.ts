import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {registerHandler, connectDB, loginHandler, validation , logoutHandler, authMiddleware} from './routes.js';
import type { Context } from 'hono/jsx';

const app = new Hono()
connectDB();

app.post("/auth" , authMiddleware);

app.post('/login', validation, loginHandler);
app.post('/register', validation, registerHandler);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app;