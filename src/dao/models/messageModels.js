import mongoose from 'mongoose';

const messageCollection = 'urban_message';

const messageSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    last_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 }
}, { timestamps: true });

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;
