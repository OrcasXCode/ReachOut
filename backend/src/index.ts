import { Hono } from 'hono'
import {userRoutes} from './routes/user'
import {businessRoutes} from './routes/business'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>()


app.route('/api/v1/user',userRoutes);
app.route('/api/v1/business',businessRoutes);

export default app
