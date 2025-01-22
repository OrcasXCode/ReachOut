import { Hono } from 'hono'

const app = new Hono()


app.get("/",(c)=>{
  return c.text('Hello World!')
})

app.post('/api/v1/user/signup', (c) => {
  return c.text('Hello Signup!')
})


app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Signin!')
})

export default app
