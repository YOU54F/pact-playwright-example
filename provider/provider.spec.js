const { test, expect } = require('@playwright/test');
const Verifier = require('@pact-foundation/pact').Verifier;
const { server } = require('./provider_Server.js');
// const { providerName, pactFile } = require('../pact.js');
const path = require('path');
const consumerName = 'GettingStartedOrderWeb';
const providerName = 'GettingStartedOrderApi';
const pactFile = path.resolve(`./pacts/${consumerName}-${providerName}.json`);
const port = 8881;
const opts = {
  provider: providerName,
  providerBaseUrl: `http://localhost:${port}`,
  pactUrls: [pactFile],
  logLevel: 'info'
};

let app;

test.describe('Pact Verification', () => {
  test.beforeAll(async () => {
    app = server.listen(port, () => {
      console.log(`Provider service listening on http://localhost:${port}`);
    });
  });
  test('Validate the expectations of Order Web', () => {
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log('Pact Verification Complete!');
        console.log(output);
      })
      .catch((e) => {
        console.error('Pact verification failed :(', e);
        throw new Error(e);
      })
      .finally(() => app.close());
  });
});
