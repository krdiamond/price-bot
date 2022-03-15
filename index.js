require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const Web3 = require('web3')
const web3 = new Web3(process.env.RPC_URL)

// POOL & EXCHANGE SETUP
const poolsAndExchanges = require('./pools&exchanges');

// TOKEN SETUP
const tokens = require('./tokens');



async function checkPair(args) {
  const { token0, token0Address, token1, token1Address } = args

  // const exchangeAddress = await poolsAndExchanges.uniswapFactoryContract.methods.getExchange(outputTokenAddress).call()
  // const exchangeContract = new web3.eth.Contract(poolsAndExchanges.UNISWAP_EXCHANGE_ABI, exchangeAddress)
  // const uniswapResult = await exchangeContract.methods.getEthToTokenInputPrice(inputAmount).call()

  // get Uniswap Pair Address
  const pairAddress = await poolsAndExchanges.uniswapFactoryContract.methods.getPair( token0Address, token1Address).call()

  //get Uniswap Pair's Contract from it's address
  const pairContract = new web3.eth.Contract(poolsAndExchanges.UNISWAP_EXCHANGE_ABI, pairAddress)
  const tokenReserves = await pairContract.methods.getReserves().call()

  console.table([{
    'Token 1': token0,
    'Token 1 Reserve': tokenReserves[0],
    'Token 2': token1,
    'Token 2 Reserve': tokenReserves[1],
    'Block Timestamp': tokenReserves[2],
    'Time': moment().tz('America/Chicago').format(),
  }])
}

let priceMonitor
let monitoringPrice = false

async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  monitoringPrice = true

  try {
    await checkPair(tokens.SHIB)
    await checkPair(tokens.DAI)

  } catch (error) {
      console.error(error)
      monitoringPrice = false
      clearInterval(priceMonitor)
    return
  }
  monitoringPrice = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 5 Seconds
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)