exports.config = {
  framework: 'mocha',
  mochaOpts: {timeout: 15000},
  seleniumServerJar: './node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.53.0.jar',
      //seleniumAddress: 'http://localhost:4444/wd/hub',
  //specs: ['tests/e2e/login.test.js','tests/e2e/ideas.tests.js']
  capabilities: {
    'browserName': 'chrome'
  }
};
