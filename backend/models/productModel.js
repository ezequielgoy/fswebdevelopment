import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
  {
    name: { type: String, enum:['jetsky', 'cuatriciclo', 'buceo', 'surf'], required: true},
    price:{type: Number, required:true},
    quantity:{type: Number, required: true},
    category:{type:String,enum:['adult','child']},    
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
