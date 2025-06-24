import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  profilePicUrl?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  purchases: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String }, // optional at first
    profilePicUrl: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('email') || this.username) {
    return next();
  }

  const baseUsername = this.email.split('@')[0].toLowerCase();
  let uniqueUsername = baseUsername;
  let counter = 0;

  // Keep checking until an unused username is found
  while (await User.exists({ username: uniqueUsername })) {
    counter++;
    uniqueUsername = `${baseUsername}${counter}`;
  }

  this.username = uniqueUsername;
  next();
});


export const User = mongoose.model<IUser>('User', userSchema);
