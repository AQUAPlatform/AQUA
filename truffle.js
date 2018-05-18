// Allows us to use ES6 in our migrations and tests.
require('babel-register')
const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')

const mnemonic = process.env.MNEMONIC
const apikey = process.env.APIKEY

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 4000000,
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic, 'https://kovan.infura.io/'+apikey),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/'+apikey),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/'+apikey),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000
    }
  }
}
