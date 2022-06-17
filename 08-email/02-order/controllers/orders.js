const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const {user} = ctx;

  const order = await Order.create({
    user,
    product,
    phone,
    address,
  });

  const {id} = order;

  const productInfo = await Product.findById(product);

  await sendMail({
    template: 'order-confirmation',
    to: user.email,
    subject: 'Подтверждение заказа',
    locals: {
      id,
      product: productInfo,
    },
  });

  ctx.body = {order: id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order
      .find({user: ctx.user.id})
      .populate('product');

  return ctx.body = {orders};
};
