import { Hono } from 'hono'
import {userRoutes} from './routes/user'
import {businessRoutes} from './routes/business'
import {categoryRoutes} from './routes/category'
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>()



// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow your frontend
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need cookies or auth headers
  })
);

app.route('/api/v1/user',userRoutes);
app.route('/api/v1/business',businessRoutes);
app.route('/api/v1/category',categoryRoutes);

export default app
