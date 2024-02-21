import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import axios from "axios";
import CryptoCoin from "../models/cryptoCoin";


interface CustomError extends Error {
    code: number;
    message: string;
}

interface Req extends Request {
    body: {
        fromCurrency?: string;
        toCurrency?: string;
        date?: string;
        currency?: string;
    }
}

interface CurrentPrice {
    [key: string]: number;
}

interface MarketCap {
    [key: string]: number;
}

interface TotalVolume {
    [key: string]: number;
}

interface MarketData {
    current_price: CurrentPrice;
    market_cap: MarketCap;
    total_volume: TotalVolume;
}
interface CryptoCoinData {
    market_data: MarketData;
}


function isValidDate(day: number, month: number, year: number) {
    if (year < 0) {
        // Handle invalid year (negative year)
        return false;
    }

    if (month < 1 || month > 12) {
        // Month should be between 1 and 12
        return false;
    }

    if (day < 1) {
        // Day should be greater than or equal to 1
        return false;
    }

    switch (month) {
        case 2: // February
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const maxDays = isLeapYear ? 29 : 28;
            return day <= maxDays;

        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
            return day <= 30;

        default:
            return day <= 31;
    }

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


export const fromCurrenyToCurrency = async (req: Request, res: Response) => {
    try {
        const { body } = req as Req;
        const { fromCurrency, toCurrency, date } = body;
        const fromCurrencyCoin = await CryptoCoin.findOne({ id: fromCurrency })
        const toCurrencyCoin = await CryptoCoin.findOne({ id: toCurrency })
        if (fromCurrencyCoin === undefined || toCurrencyCoin === undefined || fromCurrencyCoin === null || toCurrencyCoin === null) {
            return res.status(400).json({ message: "Please add valid crypto coins in the argument." });
        }
        if (date === undefined) {
            return res.status(400).json({ message: "Please add a valid date" });
        }

        const day = Number(date.slice(0, 2))
        const month = Number(date.slice(3, 5));
        const year = Number(date.slice(6, 10));

        const isValid = isValidDate(day, month, year);

        if (!isValid) {
            return res.status(400).json({ message: "Please add a valid date" });
        }
        const dateQuery = `${day}-${month}-${year}`
        const fromCurrencyCoinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrencyCoin.id}/history?date=${dateQuery}`);
        const toCurrencyCoinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${toCurrencyCoin.id}/history?date=${dateQuery}`);

        const fromCurrencyCoinData = fromCurrencyCoinResponse.data as CryptoCoinData;
        const toCurrencyCoinData = toCurrencyCoinResponse.data as CryptoCoinData;

        const fromCurrencyCoinPrice = fromCurrencyCoinData.market_data.current_price['usd'];
        const toCurrencyCoinPrice = toCurrencyCoinData.market_data.current_price['usd'];

        const relativePrice = fromCurrencyCoinPrice / toCurrencyCoinPrice;
        console.log(fromCurrencyCoinPrice,toCurrencyCoinPrice)

        return res.status(200).json({ relativePrice });
    } catch (error) {
        const e = error as CustomError;
        res.status(500).json({ message: e.message });
        return;
    }
}

