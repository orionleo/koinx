import express from "express";
import { fetchCoins } from "../controllers/coin";



let coinRoutes = express();

coinRoutes.get("/fetch-coins", fetchCoins);

export default coinRoutes;
