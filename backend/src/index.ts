import { Env, Hono } from "hono";
import { userRoutes } from "./routes/user";
import { businessRoutes } from "./routes/business";
import { categoryRoutes } from "./routes/category";
import { authRoutes } from "./auth/auth.route";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// ✅ Apply CORS globally before defining routes
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to your frontend URL
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need cookies or auth headers
  })
);

// ✅ Define API routes
app.route("/api/v1/user", userRoutes);
app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/business", businessRoutes);
app.route("/api/v1/category", categoryRoutes);

// ✅ Ensure Cloudflare Workers correctly pass `env`
export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    app.fetch(request, env, ctx), // Ensure proper Cloudflare Worker handling
};
