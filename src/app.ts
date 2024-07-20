import express, { Request, Response } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import swaggerDocs from "./utils/helpers/swagger";
dotenv.config();

const PORT = process.env.PORT || "3000";
const api = process.env.API_URL;
//middlewares
app.use(
   cors({
      origin: "http://localhost:5173",
   })
);
app.use(express.json());
app.use(cookieParser());

//routes
app.get(`/`, (req: Request, res: Response) => {
   res.send("Server runned successfully");
});

app.use(`${api}`, router);
app.use(errorMiddleware);
app.listen(PORT, () => {
   swaggerDocs(app, PORT);
   console.log(`Server is running on \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
});
