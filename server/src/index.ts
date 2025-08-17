import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import serveRequest from "./Routes/service";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;
const UI_ENDPOINT: string = process.env.UI_ENDPOINT || "http://localhost:5173";


app.use(express.json({ limit: "2mb" }));


const corsOptions: CorsOptions = {
  origin: UI_ENDPOINT,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.post("/api/plagiarism", serveRequest);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
