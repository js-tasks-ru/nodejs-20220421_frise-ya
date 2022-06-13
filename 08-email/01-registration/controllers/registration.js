const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();
  const user = new User({
    email,
    displayName,
    verificationToken,
  });

  await user.setPassword(password);
  await user.save();

  await sendMail({
    to: email,
    subject: 'Подтверждение регистрации',
    locals: {token: verificationToken},
    template: 'confirmation',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;

  await user.save();

  const token = ctx.login();

  return ctx.body = {token};
};
