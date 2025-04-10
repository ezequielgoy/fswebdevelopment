import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    nationality: String
  });

const Client = mongoose.model('Client', clientSchema);
export default Client;