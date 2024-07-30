export const calculateCommission = (orderDate: Date, total: number, productsCount: number): number => {
  const day = orderDate.getDay();
  const hour = orderDate.getHours();

  if (day >= 1 && day <= 5) {
    if (hour >= 20) {
      return total <= 100 ? 0.03 * total : (0.03 * 100) + (0.05 * (total - 100));
    }
    return 0.03 * total;
  } else {
    const commission = productsCount * 10;
    return commission > 50 ? 0.03 * total : commission;
  }
};
