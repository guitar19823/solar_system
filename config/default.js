const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  port: process.env.PORT || 5000,
  secret: process.env.SECRET || 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates')
};