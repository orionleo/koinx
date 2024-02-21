import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import coinRoutes from "./routes/coins";

let app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send("APP IS RUNNING");
});

app.use("/coins", coinRoutes);

let PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_URL!)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));
