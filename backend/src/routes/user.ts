import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';

export const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>();


//Defining the PrismClient Globallly so that we dont need to define it in every route
userRoutes.use('*', async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  
    c.set('prisma', prisma);
    await next();
});


userRoutes.post('/signup', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();
  
    try {
      const validEmail = await prisma.user.findUnique({
        where: { email: body.email },
      });
  
      if (validEmail) {
        return c.json({ error: 'Email Already Exists' }, 400);
      }
  
      //!Before storing it in DB hash it
      const user = await prisma.user.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phoneNumber: body.phoneNumber,
          password: body.password,
        },
      });
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ token: jwt });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ error: 'Internal Server Error' });
    }
});

userRoutes.use('/*', async (c, next) => {
  const jwt = c.req.header('Authorization') || " ";
  if (!jwt) {
    c.status(401);
    return c.json({ error: 'Unauthorized' });
  }

  const token = jwt.split(' ')[1];
  if (!token) {
    c.status(401);
    return c.json({ error: 'Token Missing' });
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || !payload.id) {
      c.status(401);
      return c.json({ error: 'Unauthorized' });
    }

    c.set('userId', payload.id as string);
    await next();
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});


userRoutes.post('/signin', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: 'Incorrect Credentials' });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ message: 'SignIn Successful', token: jwt });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});
