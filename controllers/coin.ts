import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import axios from "axios";
import CryptoCoin from "../models/cryptoCoin";

interface CustomError extends Error {
    code: number;
    message: string;
}
export const fetchCoins = async (req: Request, res: Response) => {
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/list");
        const coins = response.data;
        await CryptoCoin.insertMany(coins, { ordered: false });
        return res.status(200).json({ coins })
    } catch (error) {
        const e = error as CustomError;
        if (e.code === 11000 || e.code === 11001) {
            console.warn('Duplicate coins found, only new coins saved if any.');
            return res.status(200).json({ success: true, message: 'Duplicate coins found, only new coins saved if any.' });
        }
        res.status(500).json({ message: e.message });
        return;
    }
};