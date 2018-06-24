import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: String
}, { timestamps: true });


userSchema.statics.findByUsername = async function(username) {
    let user = null;

    try {
        user = this.findOne({ username });
    } catch (e) {
        throw e;
    }

    return user;
};

export default mongoose.model('user', userSchema);
