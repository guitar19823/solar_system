const Koa = require('koa');
const Router = require('koa-router');
const config = require('config');

const app = new Koa();
const router = new Router();

require('./handlers/favicon').init(app);
require('./handlers/static').init(app);
require('./handlers/logger').init(app);
require('./handlers/templates').init(app);
require('./handlers/errors').init(app);
require('./handlers/bodyParser').init(app);

router.get('/', require('./routes/index').get);
router.post('/get_contacts', require('./routes/contacts').post);
router.post('/get_descriptions', require('./routes/descriptions').post);

app.use(router.routes());

module.exports = app;