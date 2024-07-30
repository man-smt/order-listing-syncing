import { CommissionRule } from './baseRule';

const nightOrderRule: CommissionRule = {
  name: 'Night Order Rule',
  priority: 2,
  matches(order) {
    const orderDate = new Date(order.orderDate);
    const hours = orderDate.getHours();
    return hours >= 20 || hours < 6;
  },
  calculate(order) {
    return order.total * 0.15;
  },
};

export default nightOrderRule;
