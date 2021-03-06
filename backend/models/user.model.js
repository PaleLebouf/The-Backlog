const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

let userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: {unique: true},
        minlength: 1,
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },

    name: {
        type: String,
        required: false,
        minlength: 3,
    },

},{
    timestamps: true,
});

userSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;