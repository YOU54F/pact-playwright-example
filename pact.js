const pact = require('@pact-foundation/pact');
const { PactV3, MatchersV3, LogLevel } = require('@pact-foundation/pact');
const path = require('path');
const process = require('process');
const consumerName = 'GettingStartedOrderWeb';
const providerName = 'GettingStartedOrderApi';
const pactFile = path.resolve(`./pacts/${consumerName}-${providerName}.json`);

const provider = new PactV3({
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'TRACE',
  //host: "0.0.0.0",
  consumer: consumerName,
  provider: providerName,
  consumerVersion: '1.0.0'
});

// used to kill any left over mock server instances in case of errors
process.on('SIGINT', () => {
  pact.removeAllServers();
});

module.exports = {
  provider,
  pactFile,
  consumerName,
  providerName
};
