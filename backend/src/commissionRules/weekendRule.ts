import { CommissionRule } from './baseRule';

const weekendRule: CommissionRule = {
  name: 'Weekend Rule',
  priority: 1,
  matches(order) {
    const orderDate = new Date(order.orderDate);
    const dayOfWeek = orderDate.getDay();
    return dayOfWeek === 6 || dayOfWeek === 0;
  },
  calculate(order) {
    return order.total * 0.1;
  },
};

export default weekendRule;
