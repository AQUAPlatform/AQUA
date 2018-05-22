// Allows us to use ES6 in our migrations and tests.
require('babel-register')

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
    mainnet: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 8000000,
      gasPrice: 25000000000
      //from: "0x0000000000000000000000000000000000000001"
    }
  }
}
