require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const coinbaseUrl = "https://api.coinbase.com/v2";
const events = require("events");
const eventEmitter = new events.EventEmitter();

app.use(express.json());
app.use(express.urlencoded());

app.post("/webhooks/inbound-message", (req, res) => {
  console.log("received webhook");
  eventEmitter.emit("inbound-message", req.body);
  return res.send("Received Webhook successfully");
});

eventEmitter.on("inbound-message", (body) => {
  performCurrencyConversion(body).catch((err) => console.log(err));
});

async function performCurrencyConversion(body) {
  const toNumber = body.from.number;
  const message = body.message.content.text;
  const wordCount = message.split(" ");
  const wordCountLength = wordCount.length
  if (wordCountLength < 2 || wordCountLength < 5) {
    const message = standardResponse();
    return sendWhatsAppMessage(message, toNumber).catch((err) => console.log(err));
  }
  const units = wordCount[1];
  const baseCurrency = wordCount[2].toUpperCase();
  const toCurrency = wordCount[4].toUpperCase();
  const isSupportedCurrencyCodes = await getCurrencyCode(
    baseCurrency,
    toCurrency
  );
  if (!isSupportedCurrencyCodes)
    return sendWhatsAppMessage("Please provide a valid currency code", toNumber);
  const baseRate = await getBaseExchangeRate(baseCurrency, toCurrency);
  const convertedAmount = Number(units) * Number(baseRate);
  return sendWhatsAppMessage(
    `${units} ${baseCurrency} is ${convertedAmount} ${baseCurrency}`,
    toNumber
  );
}

async function sendWhatsAppMessage(message, toNumber) {
  try {
    const response = axios.post(
      "https://messages-sandbox.nexmo.com/v0.1/messages",
      {
        from: { type: "whatsapp", number: process.env.NEXMO_FROM_NUMBER },
        to: { type: "whatsapp", number: toNumber },
        message: {
          content: {
            type: "text",
            text: message,
          }
        },
      },
      {
        auth: {
          username: process.env.NEXMO_API_KEY,
          password: process.env.NEXMO_API_SECRET
        }
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

function standardResponse() {
  let response = "Welcome to the WhatsApp Bot For Currency Conversion \n";
  response += "Please use the following format to chat with the Bot \n";
  response += "Convert 5 USD to CAD \n";
  response +=
    "Where 5 is the number of units to convert, USD is the base currency and CAD is the currency you would like to convert to.";
  return response;
}

async function getCurrencyCode(baseCurrency, toCurrency) {
  try {
    const currency = await axios.get(`${coinbaseUrl}/currencies`);
    const currencyCode = currency.data.data;
    const isSupportedCurrencyCodes = currencyCode.filter(
      (c) => c.id === baseCurrency || c.id === toCurrency
    );
    if (isSupportedCurrencyCodes.length < 2) return;
    return isSupportedCurrencyCodes;
  } catch (error) {
    console.error(error);
  }
}

async function getBaseExchangeRate(baseCurrency, toCurrency) {
  try {
    const response = await axios.get(
      `${coinbaseUrl}/exchange-rates?currency=${baseCurrency}`
    );
    const rates = response.data.data.rates;
    const baseRate = rates[toCurrency];
    return baseRate;
  } catch (error) {
    console.error(error);
  }
}

app.listen(port, async () => {
  console.log(`Now listening on port: ${port}`);
});
