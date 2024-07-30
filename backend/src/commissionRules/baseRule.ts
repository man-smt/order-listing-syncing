import { IOrder } from "../models/order";

export interface CommissionRule {
  name: string;
  priority: number;
  matches(order: IOrder): boolean;
  calculate(order: IOrder): number;
}
