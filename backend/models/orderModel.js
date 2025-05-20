import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    client: {type:String, required: true},
    orderItems: [
      {
        quantity: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        }
      },
    ],
    startTime: {type: Date, required: true},
    durationTurns: {type: Number,min:1, max:3, required:true},
    endTime: {type: Date, required:true},
    discountApplied: {type:Boolean, required:true},
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum:['pending', 'paid' , 'cancelled'], default:'pending'},
    stormRefund: {type:Boolean, default:false},
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
