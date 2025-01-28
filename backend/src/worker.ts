import { Hono } from 'hono';
import { AES } from './services/aesService'; 
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';


export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
    AES_SECRET_KEY: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>();


app.post('/encrypt', async (c) => {
  const { data } = await c.req.json();
  const secretKey = process.env.AES_SECRET_KEY;

  if (!data || !secretKey) {
    return c.json({ error: 'Missing data or encryption key' }, 400);
  }

  const encrypted = await AES.encrypt(data, secretKey);
  return c.json({ encrypted });
});

app.post('/decrypt', async (c) => {
  const { encrypted, iv } = await c.req.json();
  const secretKey = process.env.AES_SECRET_KEY;

  if (!encrypted || !iv || !secretKey) {
    return c.json({ error: 'Missing encrypted data, IV, or secret key' }, 400);
  }

  const decrypted = await AES.decrypt(encrypted, iv, secretKey);
  return c.json({ decrypted });
});

export default app;
