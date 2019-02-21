exports.get = async function(ctx) {
  ctx.body = ctx.render('index.pug');
};