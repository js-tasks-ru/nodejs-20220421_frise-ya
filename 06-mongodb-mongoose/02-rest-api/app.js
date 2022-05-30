const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const validateSubcategory = require('./middlewares/validateSubcategory');
const validateObjectId = require('./middlewares/validateObjectId');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', validateSubcategory, productsBySubcategory);
router.get('/products/:id', validateObjectId, productById);

app.use(router.routes());

module.exports = app;
