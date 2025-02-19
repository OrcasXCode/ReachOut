import { Env, Hono } from "hono";
// import { userRoutes } from "./routes/user";
// import { businessRoutes } from "./routes/business";
import { categoryRoutes } from "./category/category.route";
import { authRoutes } from "./auth/auth.route";
import { userRoutes } from "./user/user.route";
import { businessRoutes } from "./business/business.route";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use(
  cors({
    origin: "http://localhost:3000", 
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);


app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/user", userRoutes);
app.route("/api/v1/business", businessRoutes);
app.route("/api/v1/category", categoryRoutes);

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    app.fetch(request, env, ctx), 
};
