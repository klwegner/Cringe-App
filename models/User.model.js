const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type:String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: [true, 'password is required']
        },

        about: {
            type: String,
        },

        profileImage: {
            type: String,
        },

        cringeArray:  [{ type: Schema.Types.ObjectId, ref: 'Cringepost' }]
    },
    {
        timestamps: true
    }
);


const User = model('User', userSchema);

module.exports = User;
