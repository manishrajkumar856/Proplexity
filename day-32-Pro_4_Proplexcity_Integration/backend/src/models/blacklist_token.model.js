import mongoose, { Schema } from "mongoose";

const BlacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: [true, "Token must be unique"],
    },
    expiredAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Set default expiration to 24 hours
    }
});

BlacklistTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });


export const BlacklistTokenModel = mongoose.model("BlacklistToken", BlacklistTokenSchema);