const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class Chat {
  constructor() {
    this.subscribes = [];
  }

  subscribe() {
    return new Promise((res) => {
      this.subscribes.push(res);
    });
  }

  publish(message) {
    this.subscribes.forEach((callback) => callback(message));

    this.clear();
  }

  clear() {
    this.subscribes = [];
  }
}

const chat = new Chat();

router.get('/subscribe', async (ctx) => {
  ctx.body = await chat.subscribe();
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;

  if (message) {
    chat.publish(message);
  }

  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
