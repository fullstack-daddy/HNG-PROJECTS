import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const {hash} = bcrypt
const { isEmail } = validator;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  organisations: [{
    type: Schema.Types.ObjectId,
    ref: 'Organisation',
  }],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model('User', userSchema);

export default User;