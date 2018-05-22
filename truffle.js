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
      host: '192.168.11.112',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 4500000,
      gasPrice: 25000000000
    }
  }
}
