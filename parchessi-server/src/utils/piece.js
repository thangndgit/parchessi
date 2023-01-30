const { getOrder } = require("./name");

exports.getId = (name) => {
  const order = getOrder(name);
  return Math.floor(order / 4);
};
