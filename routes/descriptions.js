const spObj = require('../models/objects');

exports.post = async function(ctx) {
    switch (JSON.parse(ctx.request.body.object).object) {
        case 'mercury': ctx.body = spObj.mercury; break;
        case 'venus': ctx.body = spObj.venus; break;
        case 'earth': ctx.body = spObj.earth; break;
        case 'mars': ctx.body = spObj.mars; break;
        case 'jupiter': ctx.body = spObj.jupiter; break;
        case 'saturn': ctx.body = spObj.saturn; break;
        case 'uranus': ctx.body = spObj.uranus; break;
        case 'neptune': ctx.body = spObj.neptune; break;
        case 'pluto': ctx.body = spObj.pluto; break;
        case 'sun': ctx.body = spObj.sun; break;
        case 'moon': ctx.body = spObj.moon; break;
        case 'charon': ctx.body = spObj.charon; break;
        case 'universe': ctx.body = spObj.universe; break;
    }
};
    