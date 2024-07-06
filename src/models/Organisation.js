import { Schema, model } from 'mongoose';

const organisationSchema = new Schema({
  orgId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Organisation = model('Organisation', organisationSchema);

export default Organisation;