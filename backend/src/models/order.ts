import { Schema, model, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  orderDate: Date;
  customerName: string;
  attributedStaffName: string;
  total: number;
  commission: number;
}

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  orderDate: { type: Date, required: true },
  customerName: { type: String, required: true },
  attributedStaffName: { type: String, required: true },
  total: { type: Number, required: true },
  commission: { type: Number, required: true }
});

export const Order = model<IOrder>('Order', orderSchema);
