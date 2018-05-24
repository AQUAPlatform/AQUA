// Allows us to use ES6 in our migrations and tests.
require('babel-register')

const from = process.env.FROM

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
      gasPrice: 25000000000,
      from: from
    },
    rinkeby: {
      host: '192.168.11.102',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 4500000,
      gasPrice: 1000000000,
      from: from
    }
  }
}
