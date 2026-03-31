import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    profileUrl: {
        type: String,
        default: "https://ik.imagekit.io/e6fnhg4wy/Chat-Application/Text_c80WRPP2f.jpg"
    }
}, {timestamps: true});


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;