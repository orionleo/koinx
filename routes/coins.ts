import express from "express";
import { fetchCoins, fromCurrenyToCurrency, getCompanyList } from "../controllers/coin";



let coinRoutes = express();

coinRoutes.get("/fetch-coins", fetchCoins);
coinRoutes.post("/relative-price", fromCurrenyToCurrency)
coinRoutes.post("/company-list", getCompanyList)

export default coinRoutes;
