import mongoose from "mongoose";

const userCollection = "users_urban";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true, minlength: 6 },
    role: {
        type: String, enum: ['user', 'admin', 'premium'], default: 'user'
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;

