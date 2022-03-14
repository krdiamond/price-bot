const Web3 = require('web3')
const web3 = new Web3(process.env.RPC_URL)

const SHIB = {inputTokenSymbol: 'ETH',
                inputTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                outputTokenSymbol: 'SHIB',
                outputTokenAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
                inputAmount: web3.utils.toWei('1', 'ETHER')}

const DAI = {inputTokenSymbol: 'ETH',
                inputTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                outputTokenSymbol: 'DAI',
                outputTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
                inputAmount: web3.utils.toWei('1', 'ETHER')}      
 
            


  // Export Variables
module.exports = {
    SHIB,
    DAI,
}