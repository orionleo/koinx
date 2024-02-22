# CryptoCoin API

This is a simple Express.js API for retrieving information about cryptocurrencies and performing various tasks related to crypto coins.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Fetch Coins](#fetch-coins)
  - [Convert from Currency to Currency](#convert-from-currency-to-currency)
  - [Get Company List](#get-company-list)
- [Cron Job](#cron-job)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/orionleo/crypto-api.git
   cd crypto-api
    npm install
        ```
## Usage

The API provides endpoints for fetching coin information, converting from one currency to another, and getting a list of companies related to Bitcoin or Ethereum.

## API Endpoints

1. **Fetch Coins**

   - **Endpoint:** `GET /coins/fetch-coins`
   - **Description:** Fetches and saves the list of cryptocurrencies from CoinGecko API to the MongoDB database.

2. **Convert from Currency to Currency**

   - **Endpoint:** `POST /coins/from-currency-to-currency`
   - **Description:** Converts the value of one cryptocurrency to another for a specific date.

   - **Request Body:**
     ```json
     {
       "fromCurrency": "crypto_id_1",
       "toCurrency": "crypto_id_2",
       "date": "DD-MM-YYYY"
     }
     ```

3. **Get Company List**

   - **Endpoint:** `POST /coins/get-company-list`
   - **Description:** Gets a list of companies related to Bitcoin or Ethereum.

   - **Request Body:**
     ```json
     {
       "currency": "bitcoin"
     }
     ```

## Cron Job

There is a cron job scheduled to run every hour, fetching updated coin data.