import { getOrder } from "./name";

export const getId = (name) => {
  const order = getOrder(name);
  return Math.floor(order / 4);
};
