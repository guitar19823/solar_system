const getObjectData = require('../models/objects');

exports.post = async function(ctx) {
    ctx.body = getObjectData(JSON.parse(ctx.request.body.object).object);
};