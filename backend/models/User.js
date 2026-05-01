const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    password: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    role: {
        enum:       ['admin', 'user'],
        type:       String,
        unique:     false,
        required:   true,
        default:    'user'
    }
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('user', UserSchema);
module.exports = User;