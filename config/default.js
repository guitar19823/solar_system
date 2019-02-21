const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: process.env.SECRET || 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },
  server: {
    host: 'http://localhost',
    port: 3000,
  }
};
