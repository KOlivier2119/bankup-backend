import express, { Express, Request, Response } from "express";
import router from "./routes";
import { node_env, port, redis } from "./config";
import prisma from "./lib/prisma";
import morgan from "morgan";
import cors from "cors";
import { RoleService } from "./services/roleService";
import errorHandler from './middleware/errorHandler';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message:
        "My bankUp server has been already started! let me check the changes",
    });
});

app.use(errorHandler);

app.listen(port, () => {
  prisma.$connect().then(async () => {
    await RoleService.ensureRoles();
    await redis.connect(()=>console.log("redis connected"));
    console.log("db connected");
    console.log(
      `Server is running in ${node_env} mode${
        node_env === "development" ? ` at http://localhost:${port}` : ""
      }`
    );
  });
});
