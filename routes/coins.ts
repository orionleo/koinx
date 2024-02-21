import express from "express";
import { fetchCoins, fromCurrenyToCurrency } from "../controllers/coin";



let coinRoutes = express();

coinRoutes.get("/fetch-coins", fetchCoins);
coinRoutes.post("/relative-price", fromCurrenyToCurrency)

export default coinRoutes;
